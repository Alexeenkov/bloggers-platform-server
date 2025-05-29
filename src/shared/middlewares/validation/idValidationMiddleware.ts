import { param } from 'express-validator';

export const idValidationMiddleware =
    param('id').isMongoId().withMessage('Invalid id (must be ObjectId mongodb format)');
