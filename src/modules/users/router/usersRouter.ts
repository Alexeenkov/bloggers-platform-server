import {Router} from "express";
import {createUserHandler, deleteUserHandler, getUsersListHandler} from "@/modules/users/router/handlers";
import {
    idValidationMiddleware,
    paginationAndSortingMiddleware,
    resultValidationMiddleware
} from "@/shared/middlewares/validation";
import {inputUserDataValidationMiddleware} from "@/modules/users/middlewares/validation/inputUserDataValidationMiddleware";
import {basicAuthGuardMiddleware} from "@/shared/middlewares/auth/basicAuthGuardMiddleware";

export const getUsersRouter = () => {
    const router = Router({});

    router.get('/',
        basicAuthGuardMiddleware,
        paginationAndSortingMiddleware,
        resultValidationMiddleware,
        getUsersListHandler,
    );

    router.post('/',
        basicAuthGuardMiddleware,
        inputUserDataValidationMiddleware,
        resultValidationMiddleware,
        createUserHandler,
    );

    router.delete('/:id',
        basicAuthGuardMiddleware,
        idValidationMiddleware,
        resultValidationMiddleware,
        deleteUserHandler,
    );

    return router;
};