import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {RequestWithBodyModel} from "../../../../shared/models";
import {TokensResponseModel, LoginInputDataModel} from "../../models/authModels";
import {authService} from "../../application/authService";

export const loginHandler = async (
    req: RequestWithBodyModel<LoginInputDataModel>,
    res: Response
) => {
    const accessTokenResponse: TokensResponseModel = await authService.checkCredentials(req.body);

    if (!accessTokenResponse.accessToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    res.cookie('refreshToken', accessTokenResponse.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
    }).status(HTTP_STATUSES.OK).json(accessTokenResponse);
}