import {body, ValidationChain} from "express-validator";

const loginValidation =
    body('login')
        .isString().withMessage('login should be string')
        .trim()
        .isLength({min: 3, max: 10}).withMessage('login length must be must be between 3 and 10');

const emailValidation =
    body('email')
        .isString().withMessage('email should be string')
        .trim()
        .isEmail().withMessage('email should be valid')
        .isLength({min: 6}).withMessage('email length must be must be at least 6');

const passwordValidation =
    body('password')
        .isString().withMessage('password should be string')
        .trim()
        .isLength({min: 6, max: 20}).withMessage('password length must be must be between 6 and 20');

export const inputRegistrationDataValidationMiddleware: ValidationChain[] = [
    loginValidation,
    emailValidation,
    passwordValidation,
];