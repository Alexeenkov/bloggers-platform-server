import { param } from 'express-validator';
import {ObjectId} from "mongodb";

export const idValidationMiddleware =
    param('id')
        .custom((id) => ObjectId.isValid(id));
