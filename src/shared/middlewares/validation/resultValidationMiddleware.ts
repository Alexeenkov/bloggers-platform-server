import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ErrorMessagesModel, ErrorModel} from "../../models";
import {HTTP_STATUSES} from "../../constants/httpStatuses";

const formatErrors = (error: ValidationError): ErrorModel => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path,
    message: expressError.msg,
  };
};

export const resultValidationMiddleware = (
  req: Request,
  res: Response<ErrorMessagesModel>,
  next: NextFunction,
) => {
  const errors: ErrorModel[] = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(HTTP_STATUSES.BAD_REQUEST).json({ errorsMessages: errors });

    return;
  }

  next();
};
