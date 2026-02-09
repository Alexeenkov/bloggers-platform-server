import type {WithId} from "mongodb";
import type {UserModel} from "../../users/models/usersModels";
import type {UserConfirmationEmailOutputDataModel} from "../models/authModels";

export const mappingUserConfirmationEmail = (user: WithId<UserModel>): UserConfirmationEmailOutputDataModel => {
    return {
        id: user._id.toString(),
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDate: new Date(user.emailConfirmation.expirationDate),
        isConfirmed: user.emailConfirmation.isConfirmed,
    }
};
