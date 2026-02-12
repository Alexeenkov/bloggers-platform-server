import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {authService} from "../../application/authService";
import {appConfig} from "../../../../shared/appConfig";
import {add} from "date-fns/add";

export const refreshTokenHandler = async (
    req: Request,
    res: Response,
) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    const tokens = await authService.refreshToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: appConfig.nodeEnv === 'prod',
        sameSite: 'strict',
        maxAge: add(new Date(), {days: 30}).getTime(),
    });

    res.json({
        accessToken: tokens.accessToken,
    });
};