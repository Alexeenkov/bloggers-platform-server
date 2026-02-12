import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {authService} from "../../application/authService";
import {appConfig} from "../../../../shared/appConfig";

export const logoutHandler = async (
    req: Request,
    res: Response,
) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    await authService.logout(refreshToken);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: appConfig.nodeEnv === 'prod',
        sameSite: 'strict',
    });

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};