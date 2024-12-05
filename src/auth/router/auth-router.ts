import { Router } from 'express';
import { usersController } from '../controller';
import { authValidator } from '../../app-middlewares';
import { usersValidators } from '../middlewares';

export const authRouter = Router();

authRouter.post(
    '/',
    ...usersValidators.createNewUserRequest,
    usersController.createNewUser
);
