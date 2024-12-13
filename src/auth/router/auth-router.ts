import { Router } from 'express';
import { authController } from '../controller';
import { authValidators } from '../middlewares';
import { userAuthValidator } from '../../app/middlewares';
import { routersPaths } from '../../app/configs';

export const authRouter = Router();

authRouter.post(
    routersPaths.auth.login,
    ...authValidators.loginRequest,
    authController.login
);
authRouter.get(routersPaths.auth.me, userAuthValidator, authController.me);
