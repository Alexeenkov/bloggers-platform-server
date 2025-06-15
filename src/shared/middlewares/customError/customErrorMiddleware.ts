import {NextFunction, Request, Response} from "express";
import {CustomError} from "../../utils/CustomError";
import {ErrorMessagesModel} from "../../models";
import {HTTP_STATUSES} from "../../constants/httpStatuses";

export const customErrorMiddleware = (
    err: Error,
    req: Request,
    res: Response<ErrorMessagesModel>,
    next: NextFunction,
) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).send({
            errorsMessages: [{
                field: err.field,
                message: err.message,
            }]
        });

        return;
    }

    res.sendStatus(HTTP_STATUSES.SERVER_ERROR);
};