import {Router} from "express";
import {
    createPostHandler,
    deletePostHandler,
    getPostHandler,
    getPostsListHandler,
    updatePostHandler,
} from "./handlers";
import {
    idValidationMiddleware,
    paginationAndSortingMiddleware,
    resultValidationMiddleware
} from "../../../shared/middlewares/validation";
import {inputPostDataValidationMiddleware} from "../middlewares/validation/inputPostDataValidationMiddleware";
import {basicAuthGuardMiddleware} from "../../../shared/middlewares/auth/basicAuthGuardMiddleware";

export const postsRouter = Router({});

postsRouter.get('/',
    paginationAndSortingMiddleware,
    resultValidationMiddleware,
    getPostsListHandler,
);

postsRouter.post('/',
    basicAuthGuardMiddleware,
    inputPostDataValidationMiddleware,
    resultValidationMiddleware,
    createPostHandler,
);

postsRouter.get('/:id',
    idValidationMiddleware,
    resultValidationMiddleware,
    getPostHandler,
);

postsRouter.put('/:id',
    basicAuthGuardMiddleware,
    idValidationMiddleware,
    inputPostDataValidationMiddleware,
    resultValidationMiddleware,
    updatePostHandler,
);

postsRouter.delete('/:id',
    basicAuthGuardMiddleware,
    idValidationMiddleware,
    resultValidationMiddleware,
    deletePostHandler,
);