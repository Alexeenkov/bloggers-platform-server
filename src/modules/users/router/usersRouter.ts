import {Router} from "express";
import {createUserHandler, deleteUserHandler, getUsersListHandler} from "./handlers";
import {
    idValidationMiddleware,
    paginationAndSortingMiddleware,
    resultValidationMiddleware
} from "../../../shared/middlewares/validation";
import {inputUserDataValidationMiddleware} from "../middlewares/validation/inputUserDataValidationMiddleware";
import {basicAuthGuard} from "../../../shared/middlewares/auth/basicAuthGuard";

export const usersRouter = Router({});

usersRouter.get('/',
    basicAuthGuard,
    paginationAndSortingMiddleware,
    resultValidationMiddleware,
    getUsersListHandler,
);

usersRouter.post('/',
    basicAuthGuard,
    inputUserDataValidationMiddleware,
    resultValidationMiddleware,
    createUserHandler,
);

usersRouter.delete('/:id',
    basicAuthGuard,
    idValidationMiddleware,
    resultValidationMiddleware,
    deleteUserHandler,
);
