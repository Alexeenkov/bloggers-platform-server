import type {WithId} from "mongodb";
import type {UserModel, UserOutputDataModel} from "../models/usersModels";

export const mappingUser = (user: WithId<UserModel>): UserOutputDataModel => {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
        isConfirmed: user.emailConfirmation.isConfirmed,
    }
};
