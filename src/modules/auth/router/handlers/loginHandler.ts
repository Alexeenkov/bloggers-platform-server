import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {RequestWithBodyModel} from "../../../../shared/models";
import {TokensResponseModel, LoginInputDataModel} from "../../models/authModels";
import {authService} from "../../application/authService";

export const loginHandler = async (
    req: RequestWithBodyModel<LoginInputDataModel>,
    res: Response
) => {
    const tokensResponse: TokensResponseModel = await authService.checkCredentials(req.body);

    if (!tokensResponse.accessToken || !tokensResponse.refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return;
    }

    // Устанавливаем refresh token в HttpOnly cookie
    res.cookie('refreshToken', tokensResponse.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS только в продакшене
        sameSite: 'strict', // Защита от CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    // Возвращаем только access token в теле ответа
    res.status(HTTP_STATUSES.OK).json({
        accessToken: tokensResponse.accessToken,
    });
}