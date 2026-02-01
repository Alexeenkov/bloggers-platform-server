import {Router} from "express";
import {resultValidationMiddleware} from "../../../shared/middlewares/validation";
import {idValidationMiddleware} from "../../../shared/middlewares/validation";
import {getCommentByIdHandler, updateCommentHandler, deleteCommentHandler} from "./handlers";
import {bearerAuthGuard} from "../../../shared/middlewares/auth/bearerAuthGuard";
import {inputCommentDataValidationMiddleware} from "../middlewares/validation/inputCommentDataValidationMiddleware";

export const commentsRouter = Router({});

commentsRouter.get('/:id',
    idValidationMiddleware,
    resultValidationMiddleware,
    getCommentByIdHandler,
);

commentsRouter.put('/:id',
    bearerAuthGuard,
    idValidationMiddleware,
    inputCommentDataValidationMiddleware,
    resultValidationMiddleware,
    updateCommentHandler,
);

commentsRouter.delete('/:id',
    bearerAuthGuard,
    idValidationMiddleware,
    resultValidationMiddleware,
    deleteCommentHandler,
);