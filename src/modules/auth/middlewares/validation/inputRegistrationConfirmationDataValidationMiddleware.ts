import {body, ValidationChain} from "express-validator";

const confirmationCodeValidation =
    body('code')
        .isString().withMessage('confirmation code should be string'); // TODO: Небезопасно, пользователь может ввести команду для выполнения

export const inputConfirmationValidationMiddleware: ValidationChain[] = [
    confirmationCodeValidation,
];