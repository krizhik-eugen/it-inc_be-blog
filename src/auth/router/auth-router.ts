import { Router } from 'express';
import { authController } from '../controller';
import { authValidators } from '../middlewares';

export const authRouter = Router();

authRouter.post('/login', ...authValidators.loginRequest, authController.login);
