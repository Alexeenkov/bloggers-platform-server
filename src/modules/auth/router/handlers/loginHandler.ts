import {Response} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {RequestWithBodyModel} from "@/shared/models";
import {LoginInputDataModel} from "@/modules/auth/models/authModels";
import {authService} from "@/modules/auth/application/authService";

export const loginHandler = async (
    req: RequestWithBodyModel<LoginInputDataModel>,
    res: Response
) => {
    const isSuccessfullyLogin: boolean = await authService.checkCredentials(req.body);

    if (!isSuccessfullyLogin) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
}