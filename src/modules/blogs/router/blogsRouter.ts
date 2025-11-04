import {Router} from "express";
import {
    createBlogHandler,
    createPostForSpecificBlogHandler,
    deleteBlogHandler,
    getBlogHandler,
    getBlogsListHandler,
    getPostsListForSpecificBlogHandler,
    updateBlogHandler
} from "./handlers";
import {
    idValidationMiddleware,
    paginationAndSortingMiddleware,
    resultValidationMiddleware
} from "../../../shared/middlewares/validation";
import {inputBlogDataValidationMiddleware} from "../middlewares/validation/inputBlogDataValidationMiddleware";
import {basicAuthGuardMiddleware} from "../../../shared/middlewares/auth/basicAuthGuardMiddleware";
import {inputPostDataForSpecBlogValidationMiddleware} from "../middlewares/validation/inputPostDataForSpecBlogValidationMiddleware";

export const blogsRouter = Router({});

blogsRouter.get('/',
    paginationAndSortingMiddleware,
    resultValidationMiddleware,
    getBlogsListHandler,
);

blogsRouter.post('/',
    basicAuthGuardMiddleware,
    inputBlogDataValidationMiddleware,
    resultValidationMiddleware,
    createBlogHandler,
);

blogsRouter.get('/:id',
    idValidationMiddleware,
    resultValidationMiddleware,
    getBlogHandler,
);

blogsRouter.get('/:id/posts',
    paginationAndSortingMiddleware,
    idValidationMiddleware,
    resultValidationMiddleware,
    getPostsListForSpecificBlogHandler,
);

blogsRouter.post('/:id/posts',
    basicAuthGuardMiddleware,
    inputPostDataForSpecBlogValidationMiddleware,
    idValidationMiddleware,
    paginationAndSortingMiddleware,
    resultValidationMiddleware,
    createPostForSpecificBlogHandler,
);

blogsRouter.put('/:id',
    basicAuthGuardMiddleware,
    idValidationMiddleware,
    inputBlogDataValidationMiddleware,
    resultValidationMiddleware,
    updateBlogHandler,
);

blogsRouter.delete('/:id',
    basicAuthGuardMiddleware,
    idValidationMiddleware,
    resultValidationMiddleware,
    deleteBlogHandler,
);