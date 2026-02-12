import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {usersQueryRepository} from "../../../users/repository/usersQueryRepository";
import {Request, Response} from "express";
import {MeOutputDataModel} from "../../models/authModels";

export const meHandler = async (
    req: Request,
    res: Response<MeOutputDataModel>,
) => {
    const userId = req.userId;

    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    // TODO: auth service method
    const user = await usersQueryRepository.findById(userId);

    if (!user) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    res.status(HTTP_STATUSES.OK).json({
        userId: user.id,
        login: user.login,
        email: user.email,
    });
};