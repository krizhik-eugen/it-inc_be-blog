import { Router } from 'express';
import { authController } from '../controller';
import { authValidators } from '../middlewares';
import { userAuthValidator } from '../../app-middlewares';

export const authRouter = Router();

authRouter.post('/login', ...authValidators.loginRequest, authController.login);
authRouter.get('/me', userAuthValidator, authController.me);
