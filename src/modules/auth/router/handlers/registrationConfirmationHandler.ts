import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {Response} from "express";
import {RequestWithBodyModel} from "../../../../shared/models";
import {RegistrationConfirmationInputDataModel} from "../../models/authModels";
import {authService} from "../../application/authService";

export const registrationConfirmationHandler = async (
    req: RequestWithBodyModel<RegistrationConfirmationInputDataModel>,
    res: Response,
) => {
    const isConfirmed = await authService.confirmRegistration(req.body.code);

    if (!isConfirmed) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST);
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
}