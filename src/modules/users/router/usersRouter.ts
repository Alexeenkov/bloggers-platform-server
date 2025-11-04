import {Router} from "express";
import {createUserHandler, deleteUserHandler, getUsersListHandler} from "./handlers";
import {
    idValidationMiddleware,
    paginationAndSortingMiddleware,
    resultValidationMiddleware
} from "../../../shared/middlewares/validation";
import {inputUserDataValidationMiddleware} from "../middlewares/validation/inputUserDataValidationMiddleware";
import {basicAuthGuardMiddleware} from "../../../shared/middlewares/auth/basicAuthGuardMiddleware";

export const usersRouter = Router({});

usersRouter.get('/',
    basicAuthGuardMiddleware,
    paginationAndSortingMiddleware,
    resultValidationMiddleware,
    getUsersListHandler,
);

usersRouter.post('/',
    basicAuthGuardMiddleware,
    inputUserDataValidationMiddleware,
    resultValidationMiddleware,
    createUserHandler,
);

usersRouter.delete('/:id',
    basicAuthGuardMiddleware,
    idValidationMiddleware,
    resultValidationMiddleware,
    deleteUserHandler,
);
