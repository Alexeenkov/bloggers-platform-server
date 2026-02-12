import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {RequestWithBodyModel} from "../../../../shared/models";
import {TokensResponseModel, LoginInputDataModel} from "../../models/authModels";
import {authService} from "../../application/authService";
import {appConfig} from "../../../../shared/appConfig";
import {add} from "date-fns/add";

export const loginHandler = async (
    req: RequestWithBodyModel<LoginInputDataModel>,
    res: Response
) => {
    const tokensResponse: TokensResponseModel = await authService.checkCredentials(req.body);

    res.cookie('refreshToken', tokensResponse.refreshToken, {
        httpOnly: true,
        secure: appConfig.nodeEnv === 'prod',
        sameSite: 'strict',
        maxAge: add(new Date(), {days: 30}).getTime(),
    });

    res.status(HTTP_STATUSES.OK).json({
        accessToken: tokensResponse.accessToken,
    });
}