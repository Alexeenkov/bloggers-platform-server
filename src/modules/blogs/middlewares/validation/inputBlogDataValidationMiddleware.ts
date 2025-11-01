import {body, ValidationChain} from 'express-validator';
import {REGEXPS} from "@/shared/constants/regexps";

const nameValidation =
    body('name')
        .isString().withMessage('name should be string')
        .trim()
        .isLength({ min: 2, max: 15 }).withMessage('Length of name is not correct');

const descriptionValidation =
    body('description')
        .isString().withMessage('description should be string')
        .trim()
        .isLength({ min: 10, max: 500 }).withMessage('Length of description is not correct (must be from 10 to 500 characters)');

const websiteUrlValidation =
    body('websiteUrl')
        .isString().withMessage('websiteUrl should be string')
        .trim()
        .isLength({ min: 12, max: 100 }).withMessage('Length of websiteUrl is not correct (must be from 12 to 100 characters)')
        .matches(REGEXPS.websiteUrl);

export const inputBlogDataValidationMiddleware: ValidationChain[] = [
    nameValidation,
    descriptionValidation,
    websiteUrlValidation,
];
