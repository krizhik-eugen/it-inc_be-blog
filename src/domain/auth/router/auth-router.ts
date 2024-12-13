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
