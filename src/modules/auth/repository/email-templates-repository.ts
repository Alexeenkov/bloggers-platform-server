import {db} from "../../../mongodb/db";
import {ObjectId, WithId} from "mongodb";
import {UserModel} from "../../users/models/usersModels";
import {CustomError} from "../../../shared/utils/CustomError";
import {HTTP_STATUSES} from "../../../shared/constants/httpStatuses";

export const emailTemplatesRepository = {
    async getConfirmationEmailTemplate(userId: string): Promise<string> {
        const user: WithId<UserModel> | null = await db.users.findOne({_id: new ObjectId(userId)});

        if (!user) {
            throw new CustomError('user', 'User not found', HTTP_STATUSES.NOT_FOUND);
        }

        return `
            <h1>Thank for your registration, ${user.accountData.login}!</h1>
            <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
            </p>
        `
    },
};