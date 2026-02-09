import {db} from "../../../mongodb/db";
import type {WithId} from "mongodb";
import type {UserModel} from "../../users/models/usersModels";

export const authRepository = {
    async getUserPasswordByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserModel> | null> {
        return await db.users.findOne({
            $or: [
                {'accountData.login': loginOrEmail},
                {'accountData.email': loginOrEmail},
            ],
        });
    },

    async getUserByLoginOrEmail(login: string, email: string): Promise<WithId<UserModel> | null> {
        return await db.users.findOne({
            $or: [
                {'accountData.login': login},
                {'accountData.email': email},
            ],
        });
    },
};