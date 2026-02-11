import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {authService} from "../../application/authService";

export const refreshTokenHandler = async (
    req: Request,
    res: Response,
) => {
    const {refreshToken} = req;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return;
    }

    try {
        // Генерируем новую пару токенов и инвалидируем старый refresh token
        const tokens = await authService.refreshToken(refreshToken);

        // Устанавливаем новый refresh token в HttpOnly cookie
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS в продакшене
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        });

        // Возвращаем только access token в теле ответа
        res.json({
            accessToken: tokens.accessToken,
        });
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
    }
};