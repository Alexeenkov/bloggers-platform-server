import {Router} from "express";
import {
    paginationAndSortingMiddleware,
    resultValidationMiddleware
} from "../../../shared/middlewares/validation";
import {idValidationMiddleware} from "../../../shared/middlewares/validation";
import {getCommentsListHandler, getCommentByIdHandler} from "./handlers";

export const commentsRouter = Router({});

commentsRouter.get('/',
    paginationAndSortingMiddleware,
    resultValidationMiddleware,
    getCommentsListHandler,
);

commentsRouter.get('/:id',
    idValidationMiddleware,
    resultValidationMiddleware,
    getCommentByIdHandler,
);