import {body, ValidationChain} from 'express-validator';

const contentValidation =
    body('content')
        .isString().withMessage('content should be string')
        .trim()
        .isLength({min: 20, max: 300}).withMessage('Length of content is not correct (must be from 20 to 300 characters)');

export const inputCommentDataValidationMiddleware: ValidationChain[] = [
    contentValidation,
];
