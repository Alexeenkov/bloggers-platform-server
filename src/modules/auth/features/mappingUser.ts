import {WithId} from "mongodb";
import {UserModel, UserOutputDataModel} from "../../users/models/usersModels";
import {WithIsConfirmedModel} from "../models/authModels";

export const mappingUser = (user: WithId<UserModel>): WithIsConfirmedModel<UserOutputDataModel> => {
    return {
        id: user._id.toString(),
        login: user.accountData.login,
        email: user.accountData.email,
        createdAt: user.accountData.createdAt,
        isConfirmed: user.emailConfirmation.isConfirmed,
    }
};