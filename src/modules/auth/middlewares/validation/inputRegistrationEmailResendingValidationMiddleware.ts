import {body, ValidationChain} from "express-validator";

const emailValidation =
    body('email')
        .isString().withMessage('email should be string')
        .trim()
        .isEmail().withMessage('email should be valid')
        .isLength({min: 6}).withMessage('email length must be must be at least 6');

export const inputRegistrationEmailResendingValidationMiddleware: ValidationChain[] = [
    emailValidation,
];