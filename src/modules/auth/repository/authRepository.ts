import {db} from "../../../mongodb/db";
import type {WithId} from "mongodb";
import type {UserModel} from "../../users/models/usersModels";

export const authRepository = {
    async getUserPasswordByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserModel> | null> {
        return await db.users.findOne({
            $or: [
                {login: loginOrEmail},
                {email: loginOrEmail},
            ],
        });
    },

    async getUserByLoginOrEmail(login: string, email: string): Promise<WithId<UserModel> | null> {
        return await db.users.findOne({
            $or: [
                {login: login},
                {email: email},
            ],
        });
    },
};