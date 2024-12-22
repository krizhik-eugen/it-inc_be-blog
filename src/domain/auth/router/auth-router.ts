import { Router } from 'express';
import { authController } from '../controller';
import { authValidators } from '../middlewares';
import { userAuthValidator } from '../../../app/middlewares';
import { routersPaths } from '../../../app/configs';

export const authRouter = Router();

authRouter
    .route(routersPaths.auth.login)
    .post(...authValidators.loginRequest, authController.login);

authRouter
    .route(routersPaths.auth.me)
    .get(userAuthValidator, authController.me);

authRouter
    .route(routersPaths.auth.registration)
    .post(...authValidators.registrationRequest, authController.register);

authRouter
    .route(routersPaths.auth.confirmation)
    .post(
        ...authValidators.confirmationRequest,
        authController.confirmRegistration
    );

authRouter
    .route(routersPaths.auth.resendEmail)
    .post(
        ...authValidators.resendRegistrationRequest,
        authController.resendRegistrationEmail
    );

authRouter
    .route(routersPaths.auth.refreshToken)
    .post(authController.generateNewTokens);

authRouter.route(routersPaths.auth.logout).post(authController.logout);
