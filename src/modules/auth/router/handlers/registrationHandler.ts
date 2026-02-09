import {Response} from "express";
import {RequestWithBodyModel} from "../../../../shared/models";
import {RegistrationInputDataModel} from "../../models/authModels";
import {authService} from "../../application/authService";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";

export const registrationHandler = async (
    req: RequestWithBodyModel<RegistrationInputDataModel>,
    res: Response
) => {
    await authService.registerUser({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
    });

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
}
