import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {authService} from "../../application/authService";

export const logoutHandler = async (
    req: Request,
    res: Response,
) => {
    const {refreshToken} = req;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return;
    }

    try {
        // Инвалидируем refresh token (добавляем в черный список)
        await authService.logout(refreshToken);

        // Очищаем cookie с refresh token
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.sendStatus(HTTP_STATUSES.NO_CONTENT);
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
    }
};