import {Router} from "express";
import {resultValidationMiddleware} from "../../../shared/middlewares/validation";
import {idValidationMiddleware} from "../../../shared/middlewares/validation";
import {getCommentByIdHandler, updateCommentHandler, deleteCommentHandler} from "./handlers";

export const commentsRouter = Router({});

commentsRouter.get('/:id',
    idValidationMiddleware,
    resultValidationMiddleware,
    getCommentByIdHandler,
);

commentsRouter.put('/:id',
    idValidationMiddleware,
    resultValidationMiddleware,
    updateCommentHandler,
);

commentsRouter.delete('/:id',
    idValidationMiddleware,
    resultValidationMiddleware,
    deleteCommentHandler,
);