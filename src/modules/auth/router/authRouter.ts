import {Router} from "express";
import {
    loginHandler,
    registrationConfirmationHandler,
    registrationEmailResendingHandler,
    registrationHandler,
    logoutHandler,
    refreshTokenHandler,
    meHandler,
} from "./handlers";
import {resultValidationMiddleware} from "../../../shared/middlewares/validation";
import {inputAuthDataValidationMiddleware} from "../middlewares/validation/inputAuthDataValidationMiddleware";
import {inputUserDataValidationMiddleware} from "../../users/middlewares/validation/inputUserDataValidationMiddleware";
import {inputConfirmationValidationMiddleware} from "../middlewares/validation/inputRegistrationConfirmationDataValidationMiddleware";
import {inputRegistrationEmailResendingValidationMiddleware} from "../middlewares/validation/inputRegistrationEmailResendingValidationMiddleware";
import {bearerAuthGuard} from "../../../shared/middlewares/auth/bearerAuthGuard";

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
    logoutHandler,
);

authRouter.post('/refresh-token',
    refreshTokenHandler,
);

authRouter.get('/me',
    bearerAuthGuard,
    resultValidationMiddleware,
    meHandler,
);