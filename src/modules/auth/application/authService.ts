import {authRepository} from "../repository/authRepository";
import type {TokensResponseModel, LoginInputDataModel, RegistrationInputDataModel} from "../models/authModels";
import bcrypt from "bcrypt";
import type {WithId} from "mongodb";
import type {UserModel, UserOutputDataModel} from "../../users/models/usersModels";
import {jwtService} from "../adapters/jwt-service";
import {usersService} from "../../users/application/usersService";
import {HTTP_STATUSES} from "../../../shared/constants/httpStatuses";
import {CustomError} from "../../../shared/utils/CustomError";
import {emailAdapter} from "../../../shared/adapters/emailAdapter";
import {emailTemplatesRepository} from "../repository/email-templates-repository";
import {usersRepository} from "../../users/repository/usersRepository";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";
import {createDateISO} from "../../../shared/utils/createDateISO";
import {refreshTokenRepository} from "../repository/refreshTokenRepository";

export const authService = {
    async checkCredentials(data: LoginInputDataModel): Promise<TokensResponseModel> {
        const user: WithId<UserModel> | null = await authRepository.getUserPasswordByLoginOrEmail(data.loginOrEmail);

        if (!user) {
            return {
                accessToken: null,
                refreshToken: null,
            };
        }

        const isPasswordCorrect: boolean = await bcrypt.compare(data.password, user.accountData.password);

        if (!isPasswordCorrect) {
            return {
                accessToken: null,
                refreshToken: null,
            };
        }

        return {
            accessToken: jwtService.createToken(user._id.toString()),
            refreshToken: jwtService.createRefreshToken(user._id.toString()),
        };
    },

    async registerUser(data: RegistrationInputDataModel): Promise<UserOutputDataModel> {
        const newUser: UserOutputDataModel = await usersService.create({
            login: data.login,
            email: data.email,
            password: data.password,
        });

        if (!newUser) {
            throw new CustomError('user', 'User not created', HTTP_STATUSES.BAD_REQUEST);
        }

        await this.sendConfirmationEmail(newUser);

        return newUser;
    },

    async sendConfirmationEmail(user: UserOutputDataModel): Promise<void> {
        try {
            const template = await emailTemplatesRepository.getConfirmationEmailTemplate(user.id);

            await emailAdapter.sendEmail(user.email, 'Welcome to the platform', template);
        } catch (error) {
            console.error(error)
            await usersRepository.delete(user.id);
            throw new CustomError('email', 'Email not sent', HTTP_STATUSES.BAD_REQUEST);
        }
    },

    async confirmRegistration(code: string): Promise<boolean> {
        const user = await authRepository.getUserByConfirmationCode(code);

        if (!user) {
            throw new CustomError('code', 'Confirmation code is incorrect', HTTP_STATUSES.BAD_REQUEST);
        }

        if (user.isConfirmed === true) {
            throw new CustomError('code', 'User already confirmed', HTTP_STATUSES.BAD_REQUEST);
        }

        if (user.expirationDate < new Date()) {
            throw new CustomError('user', 'User confirmation code expired', HTTP_STATUSES.BAD_REQUEST);
        }

        const isConfirmed = await authRepository.confirmUser(user.id);

        if (!isConfirmed) {
            throw new CustomError('user', 'User confirmation failed', HTTP_STATUSES.BAD_REQUEST);
        }

        return isConfirmed;
    },

    async resendConfirmationEmail(email: string): Promise<void> {
        const user = await authRepository.getUserByEmail(email);

        if (!user) {
            throw new CustomError('email', 'Email is incorrect', HTTP_STATUSES.BAD_REQUEST);
        }

        if (user.isConfirmed === true) {
            throw new CustomError('email', 'User already confirmed', HTTP_STATUSES.BAD_REQUEST);
        }

        const newConfirmationCode = randomUUID();
        const newExpirationDate = createDateISO(add(new Date(), {hours: 1}));

        await authRepository.updateConfirmationCode(user.id, newConfirmationCode, newExpirationDate);
        await this.sendConfirmationEmail(user);
    },

    async refreshToken(refreshToken: string): Promise<TokensResponseModel> {
        const tokenPayload = jwtService.verifyRefreshToken(refreshToken);

        if (!tokenPayload || typeof tokenPayload === 'string') {
            throw new CustomError('token', 'Invalid token', HTTP_STATUSES.UNAUTHORIZED);
        }

        // Проверяем наличие userId в payload
        if (!tokenPayload.userId) {
            throw new CustomError('token', 'Invalid token payload', HTTP_STATUSES.UNAUTHORIZED);
        }

        // Проверяем, не инвалидирован ли токен (черный список)
        // ВАЖНО: Проверка в service слое (не в middleware) для соблюдения слоистой архитектуры
        const isTokenInvalidated = await refreshTokenRepository.isTokenInvalidated(refreshToken);

        if (isTokenInvalidated) {
            throw new CustomError('token', 'Token has been revoked', HTTP_STATUSES.UNAUTHORIZED);
        }

        // Инвалидируем старый refresh token (rotation tokens для безопасности)
        // Конвертируем exp (Unix timestamp в секундах) в Date объект
        const expiresAtDate = tokenPayload.exp 
            ? new Date(tokenPayload.exp * 1000) 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // fallback: 30 дней

        await refreshTokenRepository.setInvalidatedToken({
            token: refreshToken,
            userId: tokenPayload.userId,
            expiresAt: expiresAtDate,
            invalidatedAt: new Date(),
        });

        const {userId} = tokenPayload;

        // Генерируем новую пару токенов
        return {
            accessToken: jwtService.createToken(userId),
            refreshToken: jwtService.createRefreshToken(userId),
        };
    },

    async logout(refreshToken: string): Promise<void> {
        const tokenPayload = jwtService.verifyRefreshToken(refreshToken);

        if (!tokenPayload || typeof tokenPayload === 'string') {
            throw new CustomError('token', 'Invalid token', HTTP_STATUSES.UNAUTHORIZED);
        }

        if (!tokenPayload.userId) {
            throw new CustomError('token', 'Invalid token payload', HTTP_STATUSES.UNAUTHORIZED);
        }

        // Проверяем, не инвалидирован ли токен уже
        const isTokenInvalidated = await refreshTokenRepository.isTokenInvalidated(refreshToken);

        if (isTokenInvalidated) {
            // Токен уже в черном списке, просто возвращаемся
            return;
        }

        // Добавляем токен в черный список
        const expiresAtDate = tokenPayload.exp 
            ? new Date(tokenPayload.exp * 1000) 
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        await refreshTokenRepository.setInvalidatedToken({
            token: refreshToken,
            userId: tokenPayload.userId,
            expiresAt: expiresAtDate,
            invalidatedAt: new Date(),
        });
    },
};