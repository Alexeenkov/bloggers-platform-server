import {Router} from "express";
import {
    loginHandler,
    registrationConfirmationHandler,
    registrationEmailResendingHandler,
    registrationHandler,
    logoutHandler,
    refreshTokenHandler,
} from "./handlers";
import {resultValidationMiddleware} from "../../../shared/middlewares/validation";
import {inputAuthDataValidationMiddleware} from "../middlewares/validation/inputAuthDataValidationMiddleware";
import {inputUserDataValidationMiddleware} from "../../users/middlewares/validation/inputUserDataValidationMiddleware";
import {inputConfirmationValidationMiddleware} from "../middlewares/validation/inputRegistrationConfirmationDataValidationMiddleware";
import {inputRegistrationEmailResendingValidationMiddleware} from "../middlewares/validation/inputRegistrationEmailResendingValidationMiddleware";
import {refreshTokenGuard} from "../../../shared/middlewares/auth/refreshTokenGuard";

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

authRouter.post('/registration-email-resending',
    inputRegistrationEmailResendingValidationMiddleware,
    resultValidationMiddleware,
    registrationEmailResendingHandler,
);

authRouter.post('/logout',
    refreshTokenGuard,
    resultValidationMiddleware,
    logoutHandler,
);

authRouter.post('/refresh-token',
    refreshTokenGuard,
    resultValidationMiddleware,
    refreshTokenHandler,
);