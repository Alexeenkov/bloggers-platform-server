import {body, ValidationChain} from 'express-validator';

const titleValidation =
    body('title')
        .isString().withMessage('title should be string')
        .trim()
        .isLength({ min: 2, max: 30 }).withMessage('Length of title is not correct (must be from 2 to 30 characters)');

const shortDescriptionValidation =
    body('shortDescription')
        .isString().withMessage('shortDescription should be string')
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Length of shortDescription is not correct (must be from 2 to 100 characters)');

const contentValidation =
    body('content')
        .isString().withMessage('content should be string')
        .trim()
        .isLength({ min: 2, max: 1000 }).withMessage('Length of content is not correct (must be from 2 to 1000 characters)');

export const inputPostDataForSpecBlogValidationMiddleware: ValidationChain[] = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
];
