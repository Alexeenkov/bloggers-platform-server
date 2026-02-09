import {Router} from "express";
import {loginHandler, registrationConfirmationHandler, registrationHandler} from "./handlers";
import {resultValidationMiddleware} from "../../../shared/middlewares/validation";
import {inputAuthDataValidationMiddleware} from "../middlewares/validation/inputAuthDataValidationMiddleware";
import {inputUserDataValidationMiddleware} from "../../users/middlewares/validation/inputUserDataValidationMiddleware";
import {inputConfirmationValidationMiddleware} from "../middlewares/validation/inputRegistrationConfirmationDataValidationMiddleware";

export const authRouter = Router({});

authRouter.post('/login',
    inputAuthDataValidationMiddleware,
    resultValidationMiddleware,
    loginHandler,
);

authRouter.post('/registration',
    inputUserDataValidationMiddleware,
    resultValidationMiddleware,
    registrationHandler,
);

authRouter.post('/registration-confirmation',
    inputConfirmationValidationMiddleware,
    resultValidationMiddleware,
    registrationConfirmationHandler,
);