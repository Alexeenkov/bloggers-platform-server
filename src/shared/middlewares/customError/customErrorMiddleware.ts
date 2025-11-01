import {NextFunction, Request, Response} from "express";
import {CustomError} from "@/shared/utils/CustomError";
import {ErrorMessagesModel} from "@/shared/models";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";

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