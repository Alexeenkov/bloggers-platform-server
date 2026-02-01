import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {RequestWithBodyModel} from "../../../../shared/models";
import {AccessTokenResponseModel, LoginInputDataModel} from "../../models/authModels";
import {authService} from "../../application/authService";

export const loginHandler = async (
    req: RequestWithBodyModel<LoginInputDataModel>,
    res: Response
) => {
    const accessTokenResponse: AccessTokenResponseModel = await authService.checkCredentials(req.body);

    if (!accessTokenResponse.accessToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    res.status(HTTP_STATUSES.OK).json(accessTokenResponse);
}