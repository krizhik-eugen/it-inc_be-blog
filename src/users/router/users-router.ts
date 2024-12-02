import { Router } from 'express';
import { usersController } from '../controller';
import { authValidator } from '../../app-middlewares';
import { usersValidators } from '../middlewares';

export const usersRouter = Router();

usersRouter.get(
    '/',
    ...authValidator,
    ...usersValidators.getUsersRequest,
    usersController.getAllUsers
);

usersRouter.post(
    '/',
    ...authValidator,
    ...usersValidators.createNewUserRequest,
    usersController.createNewUser
);

usersRouter.delete(
    '/:id',
    ...authValidator,
    ...usersValidators.deleteUserRequest,
    usersController.deleteUser
);
