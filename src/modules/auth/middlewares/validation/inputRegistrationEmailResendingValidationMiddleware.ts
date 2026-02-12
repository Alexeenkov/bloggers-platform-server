import {body, ValidationChain} from "express-validator";
import {REGEXPS} from "../../../../shared/constants/regexps";

const emailValidation =
    body('email')
        .isString().withMessage('email should be string')
        .trim()
        .matches(REGEXPS.email).withMessage('email should be valid')
        .isLength({min: 6}).withMessage('email length must be must be at least 6');

export const inputRegistrationEmailResendingValidationMiddleware: ValidationChain[] = [
    emailValidation,
];