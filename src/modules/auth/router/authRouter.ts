import {Router} from "express";
import {loginHandler} from "./handlers";
import {resultValidationMiddleware} from "../../../shared/middlewares/validation";
import {inputAuthDataValidationMiddleware} from "../middlewares/validation/inputAuthDataValidationMiddleware";

export const authRouter = Router({});

authRouter.post('/login',
    inputAuthDataValidationMiddleware,
    resultValidationMiddleware,
    loginHandler,
);