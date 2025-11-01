import {authRepository} from "@/modules/auth/repository/authRepository";
import {LoginInputDataModel} from "@/modules/auth/models/authModels";
import bcrypt from "bcrypt";
import {WithId} from "mongodb";
import {UserModel} from "@/modules/users/models/usersModels";

export const authService = {
    async checkCredentials(data: LoginInputDataModel): Promise<boolean> {
        const user: WithId<UserModel> | null = await authRepository.getUserPasswordByLoginOrEmail(data.loginOrEmail);

        if (!user) return false;

        return await bcrypt.compare(data.password, user.password);
    },
};