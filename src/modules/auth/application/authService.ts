import {authRepository} from "../repository/authRepository";
import type {AccessTokenResponseModel, LoginInputDataModel} from "../models/authModels";
import bcrypt from "bcrypt";
import type {WithId} from "mongodb";
import type {UserModel} from "../../users/models/usersModels";
import {jwtService} from "../adapters/jwt-service";

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
};