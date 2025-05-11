import {IErrorMessages, IValidationError} from "../interfaces/ValidationError";

export const createErrorMessages = (errors: IValidationError[]): IErrorMessages => {
  return {
    errorsMessages: errors,
  };
};
