import {Request, Response} from "express";
import {jwtService} from "../../adapters/jwt-service";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";

export const refreshTokenHandler = async (
    req: Request,
    res: Response,
) => {
    const {userId} = req;

    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    const refreshToken = jwtService.createRefreshToken(userId);

    res.json({refreshToken});
};