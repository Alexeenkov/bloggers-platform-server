import {Router} from "express";
import {
    createPostHandler,
    deletePostHandler,
    getPostHandler,
    getPostsListHandler,
    updatePostHandler,
    getCommentsForSpecificPostHandler,
    createCommentForSpecificPostHandler,
} from "./handlers";
import {
    idValidationMiddleware,
    paginationAndSortingMiddleware,
    resultValidationMiddleware
} from "../../../shared/middlewares/validation";
import {inputPostDataValidationMiddleware} from "../middlewares/validation/inputPostDataValidationMiddleware";
import {basicAuthGuard} from "../../../shared/middlewares/auth/basicAuthGuard";
import {bearerAuthGuard} from "../../../shared/middlewares/auth/bearerAuthGuard";
import {inputCommentDataValidationMiddleware} from "../../comments/middlewares/validation/inputCommentDataValidationMiddleware";

export const postsRouter = Router({});

postsRouter.get('/',
    paginationAndSortingMiddleware,
    resultValidationMiddleware,
    getPostsListHandler,
);

postsRouter.post('/',
    basicAuthGuard,
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
    basicAuthGuard,
    idValidationMiddleware,
    inputPostDataValidationMiddleware,
    resultValidationMiddleware,
    updatePostHandler,
);

postsRouter.delete('/:id',
    basicAuthGuard,
    idValidationMiddleware,
    resultValidationMiddleware,
    deletePostHandler,
);

postsRouter.get('/:id/comments',
    paginationAndSortingMiddleware,
    idValidationMiddleware,
    resultValidationMiddleware,
    getCommentsForSpecificPostHandler,
);

postsRouter.post('/:id/comments',
    bearerAuthGuard,
    idValidationMiddleware,
    inputCommentDataValidationMiddleware,
    resultValidationMiddleware,
    createCommentForSpecificPostHandler,
);
