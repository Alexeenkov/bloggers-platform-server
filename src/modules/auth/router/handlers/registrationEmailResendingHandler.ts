import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {Response} from "express";
import {RequestWithBodyModel} from "../../../../shared/models";
import {authService} from "../../application/authService";

export const registrationEmailResendingHandler = async (
    req: RequestWithBodyModel<{email: string}>,
    res: Response,
) => {
    const {email} = req.body;

    await authService.resendConfirmationEmail(email);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
}