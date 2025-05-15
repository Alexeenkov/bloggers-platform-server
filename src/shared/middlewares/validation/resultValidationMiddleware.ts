import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import {NextFunction, Request, Response} from 'express';
import {ValidationErrorModel} from "../../models";
import {HTTP_STATUSES} from "../../constants/httpStatuses";

const formatErrors = (error: ValidationError): ValidationErrorModel => {
  const expressError = error as unknown as FieldValidationError;

  return {
    field: expressError.path,
    message: expressError.msg,
  };
};

export const resultValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: ValidationErrorModel[] = validationResult(req).formatWith(formatErrors).array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(HTTP_STATUSES.BAD_REQUEST).json({ errorsMessages: errors });

    return;
  }

  next();
};
