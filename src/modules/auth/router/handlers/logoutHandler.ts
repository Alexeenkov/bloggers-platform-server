import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";

export const logoutHandler = async (
    req: Request,
    res: Response,
) => {
    const {userId} = req;

    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};