import {db} from "../../../mongodb/db";
import type {UpdateResult, WithId} from "mongodb";
import type {UserModel} from "../../users/models/usersModels";
import {ObjectId} from "mongodb";
import {mappingUserConfirmationEmail} from "../features/mappingUserConfirmationEmail";
import {UserConfirmationEmailOutputDataModel} from "../models/authModels";
import {UserOutputDataModel} from "../../users/models/usersModels";
import {mappingUser} from "../../users/features/mappingUser";

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

    async getUserByConfirmationCode(code: string): Promise<UserConfirmationEmailOutputDataModel | null> {
        const user = await db.users.findOne({'emailConfirmation.confirmationCode': code});

        if (!user) {
            return null
        }

        return mappingUserConfirmationEmail(user);
    },

    async confirmUser(id: string): Promise<boolean> {
        const _id: ObjectId = new ObjectId(id);

        const result: UpdateResult = await db.users.updateOne(
            {_id},
            {$set: {'emailConfirmation.isConfirmed': true}},
        );

        return result.matchedCount === 1;
    },

    async getUserByEmail(email: string): Promise<UserOutputDataModel | null> {
        const user = await db.users.findOne({'accountData.email': email});

        if (!user) {
            return null
        }

        return mappingUser(user);
    },

    async updateConfirmationCode(id: string, confirmationCode: string, expirationDate: string): Promise<boolean> {
        const _id: ObjectId = new ObjectId(id);

        const result: UpdateResult = await db.users.updateOne(
            {_id},
            {
                $set: {
                    'emailConfirmation.confirmationCode': confirmationCode,
                    'emailConfirmation.expirationDate': expirationDate
                }
            },
        );

        return result.matchedCount === 1;
    },
};