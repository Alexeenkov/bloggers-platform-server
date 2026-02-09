import {authRepository} from "../repository/authRepository";
import type {AccessTokenResponseModel, LoginInputDataModel, RegistrationInputDataModel} from "../models/authModels";
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

export const authService = {
    async checkCredentials(data: LoginInputDataModel): Promise<AccessTokenResponseModel> {
        const user: WithId<UserModel> | null = await authRepository.getUserPasswordByLoginOrEmail(data.loginOrEmail);

        if (!user) {
            return {
                accessToken: null,
            };
        }

        console.log('user', user);

        const isPasswordCorrect: boolean = await bcrypt.compare(data.password, user.accountData.password);

        if (!isPasswordCorrect) {
            return {
                accessToken: null,
            };
        }

        return {
            accessToken: jwtService.createToken(user._id.toString()),
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

        try {
            const template = await emailTemplatesRepository.getConfirmationEmailTemplate(newUser.id);

            await emailAdapter.sendEmail(newUser.email, 'Welcome to the platform', template);
        } catch (error) {
            console.error(error)
            await usersRepository.delete(newUser.id);
            throw new CustomError('email', 'Email not sent', HTTP_STATUSES.BAD_REQUEST);
        }

        return newUser;
    },

    async confirmRegistration(code: string): Promise<boolean> {
        const user = await authRepository.getUserByConfirmationCode(code);

        if (!user) {
            throw new CustomError('user', 'User not found', HTTP_STATUSES.NOT_FOUND);
        }

        if (user.isConfirmed === true) {
            throw new CustomError('user', 'User already confirmed', HTTP_STATUSES.BAD_REQUEST);
        }

        if (user.expirationDate < new Date()) {
            throw new CustomError('user', 'User confirmation code expired', HTTP_STATUSES.BAD_REQUEST);
        }

        const isConfirmed = await authRepository.confirmUser(user.id);

        console.log('isConfirmed', isConfirmed);

        if (!isConfirmed) {
            throw new CustomError('user', 'User confirmation failed', HTTP_STATUSES.BAD_REQUEST);
        }

        return isConfirmed;
    },
};