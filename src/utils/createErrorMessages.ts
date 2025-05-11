import {ErrorMessagesModel, ValidationErrorModel} from "../models";

export const createErrorMessages = (errors: ValidationErrorModel[]): ErrorMessagesModel => {
  return {
    errorsMessages: errors,
  };
};
