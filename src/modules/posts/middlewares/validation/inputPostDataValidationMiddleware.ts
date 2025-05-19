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
        .isLength({ min: 10, max: 100 }).withMessage('Length of shortDescription is not correct (must be from 10 to 100 characters)');

const contentValidation =
    body('content')
        .isString().withMessage('content should be string')
        .trim()
        .isLength({ min: 10, max: 1000 }).withMessage('Length of content is not correct (must be from 20 to 1000 characters)');

const blogIdValidation =
    body('blogId')
        .notEmpty().withMessage('blogId should not be empty')
        .isString().withMessage('blogId should be string')
        .trim();

export const inputPostDataValidationMiddleware: ValidationChain[] = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation,
];
