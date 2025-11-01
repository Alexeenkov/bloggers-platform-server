import {Router} from "express";
import {loginHandler} from "@/modules/auth/router/handlers";
import {resultValidationMiddleware} from "@/shared/middlewares/validation";
import {inputAuthDataValidationMiddleware} from "@/modules/auth/middlewares/validation/inputAuthDataValidationMiddleware";

export const getAuthRouter = () => {
    const router = Router({});

    router.post('/login',
        inputAuthDataValidationMiddleware,
        resultValidationMiddleware,
        loginHandler,
    );

    return router;
};