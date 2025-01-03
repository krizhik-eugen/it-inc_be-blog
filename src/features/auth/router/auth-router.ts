import { Router } from 'express';
import { authController } from '../controller';
import { authValidators } from '../middlewares';
import { userAuthValidator } from '../../../app/middlewares';
import { routersPaths } from '../../../app/configs';
import { rateLimiter } from '../../../app/middlewares/rate-limit';

export const authRouter = Router();

authRouter
    .route(routersPaths.auth.login)
    .post(rateLimiter, ...authValidators.loginRequest, authController.login);

authRouter
    .route(routersPaths.auth.me)
    .get(userAuthValidator, authController.me);

authRouter
    .route(routersPaths.auth.registration)
    .post(
        rateLimiter,
        ...authValidators.registrationRequest,
        authController.register
    );

authRouter
    .route(routersPaths.auth.confirmation)
    .post(
        rateLimiter,
        ...authValidators.confirmationRequest,
        authController.confirmRegistration
    );

authRouter
    .route(routersPaths.auth.resendEmail)
    .post(
        rateLimiter,
        ...authValidators.resendRegistrationRequest,
        authController.resendRegistrationEmail
    );

authRouter
    .route(routersPaths.auth.refreshToken)
    .post(authController.createNewSession);

authRouter.route(routersPaths.auth.logout).post(authController.logout);
