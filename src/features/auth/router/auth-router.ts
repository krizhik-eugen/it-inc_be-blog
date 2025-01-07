import { Router } from 'express';
import { authValidators } from '../middlewares';
import { userAuthValidator, rateLimiter } from '../../../app/middlewares';
import { routersPaths } from '../../../app/configs';
import { authController } from '../composition-root';

export const authRouter = Router();

authRouter
    .route(routersPaths.auth.login)
    .post(
        rateLimiter,
        ...authValidators.loginRequest,
        authController.login.bind(authController)
    );

authRouter
    .route(routersPaths.auth.me)
    .get(userAuthValidator, authController.me.bind(authController));

authRouter
    .route(routersPaths.auth.registration)
    .post(
        rateLimiter,
        ...authValidators.registrationRequest,
        authController.register.bind(authController)
    );

authRouter
    .route(routersPaths.auth.confirmation)
    .post(
        rateLimiter,
        ...authValidators.confirmationRequest,
        authController.confirmRegistration.bind(authController)
    );

authRouter
    .route(routersPaths.auth.resendEmail)
    .post(
        rateLimiter,
        ...authValidators.resendRegistrationRequest,
        authController.resendRegistrationEmail.bind(authController)
    );

authRouter
    .route(routersPaths.auth.refreshToken)
    .post(authController.createNewSession.bind(authController));

authRouter
    .route(routersPaths.auth.passwordRecovery)
    .post(
        rateLimiter,
        ...authValidators.passwordRecoveryRequest,
        authController.passwordRecovery.bind(authController)
    );

authRouter
    .route(routersPaths.auth.newPassword)
    .post(
        rateLimiter,
        ...authValidators.newPasswordRequest,
        authController.newPassword.bind(authController)
    );

authRouter
    .route(routersPaths.auth.logout)
    .post(authController.logout.bind(authController));
