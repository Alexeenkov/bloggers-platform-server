import {authRepository} from "../repository/authRepository";
import type {AccessTokenResponseModel, LoginInputDataModel, RegistrationInputDataModel} from "../models/authModels";
import bcrypt from "bcrypt";
import type {WithId} from "mongodb";
import type {UserModel, UserOutputDataModel} from "../../users/models/usersModels";
import {jwtService} from "../adapters/jwt-service";
import {usersService} from "../../users/application/usersService";
import {HTTP_STATUSES} from "../../../shared/constants/httpStatuses";
import {CustomError} from "../../../shared/utils/CustomError";

export const authService = {
    async checkCredentials(data: LoginInputDataModel): Promise<AccessTokenResponseModel> {
        const user: WithId<UserModel> | null = await authRepository.getUserPasswordByLoginOrEmail(data.loginOrEmail);

        if (!user) {
            return {
                accessToken: null,
            };
        }

        const isPasswordCorrect: boolean = await bcrypt.compare(data.password, user.password);

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

        return newUser;
    },
};