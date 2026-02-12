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
import {invalidTokensRepository} from "../repository/invalidTokensRepository";
import {TokenPayloadModel} from "../models/refreshTokenModels";

export const authService = {
    async checkCredentials(data: LoginInputDataModel): Promise<TokensResponseModel> {
        const user: WithId<UserModel> | null = await authRepository.getUserPasswordByLoginOrEmail(data.loginOrEmail);

        if (!user) {
            throw new CustomError('user', 'Invalid login or email', HTTP_STATUSES.UNAUTHORIZED);
        }

        const isPasswordCorrect: boolean = await bcrypt.compare(data.password, user.accountData.password);

        if (!isPasswordCorrect) {
            throw new CustomError('user', 'Invalid login or email', HTTP_STATUSES.UNAUTHORIZED);
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

    async validateRefreshToken(token: string): Promise<TokenPayloadModel> {
        let tokenPayload;

        try {
            tokenPayload = jwtService.verifyRefreshToken(token);
        } catch (error) {
            throw new CustomError('token', 'Invalid token', HTTP_STATUSES.UNAUTHORIZED);
        }

        const isTokenInvalidated = await invalidTokensRepository.checkTokenInvalidated(token);

        const accessDenied =
            !tokenPayload
            || typeof tokenPayload === 'string'
            || !tokenPayload.userId
            || isTokenInvalidated;

        if (accessDenied) {
            throw new CustomError('token', 'Invalid token', HTTP_STATUSES.UNAUTHORIZED);
        }

        return tokenPayload as TokenPayloadModel;
    },

    async invalidateRefreshToken(tokenPayload: TokenPayloadModel, refreshToken: string): Promise<void> {
        const expiresAtDate = tokenPayload.exp
            ? new Date(tokenPayload.exp * 1000)
            : add(new Date(), {days: 30});

        await invalidTokensRepository.setInvalidatedToken({
            token: refreshToken,
            userId: tokenPayload.userId,
            expiresAt: expiresAtDate,
            invalidatedAt: new Date(),
        });
    },

    async refreshToken(refreshToken: string): Promise<TokensResponseModel> {
        const tokenPayload = await this.validateRefreshToken(refreshToken);

        const expiresAtDate = tokenPayload.exp
            ? new Date(tokenPayload.exp * 1000)
            : add(new Date(), {days: 30});

        await invalidTokensRepository.setInvalidatedToken({
            token: refreshToken,
            userId: tokenPayload.userId,
            expiresAt: expiresAtDate,
            invalidatedAt: new Date(),
        });

        const {userId} = tokenPayload;

        return {
            accessToken: jwtService.createToken(userId),
            refreshToken: jwtService.createRefreshToken(userId),
        };
    },

    async logout(refreshToken: string): Promise<void> {
        const tokenPayload = await this.validateRefreshToken(refreshToken);

        await this.invalidateRefreshToken(tokenPayload, refreshToken);
    },
};