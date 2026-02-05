import {Router} from "express";
import {loginHandler} from "./handlers";
import {resultValidationMiddleware} from "../../../shared/middlewares/validation";
import {inputAuthDataValidationMiddleware} from "../middlewares/validation/inputAuthDataValidationMiddleware";
import {registrationHandler} from "./handlers/registrationHandler";
import {inputRegistrationDataValidationMiddleware} from "../middlewares/validation/inputRegistrationDataValidationMiddleware";

export const authRouter = Router({});

authRouter.post('/login',
    inputAuthDataValidationMiddleware,
    resultValidationMiddleware,
    loginHandler,
);

authRouter.post('/registration',
    inputRegistrationDataValidationMiddleware,
    resultValidationMiddleware,
    registrationHandler,
);