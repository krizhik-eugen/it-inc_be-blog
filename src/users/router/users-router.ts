import { Router } from 'express';
import { usersController } from '../controller';
import { adminAuthValidator } from '../../app-middlewares';
import { usersValidators } from '../middlewares';

export const usersRouter = Router();

usersRouter.get(
    '/',
    ...adminAuthValidator,
    ...usersValidators.getUsersRequest,
    usersController.getAllUsers
);

usersRouter.post(
    '/',
    ...adminAuthValidator,
    ...usersValidators.createNewUserRequest,
    usersController.createNewUser
);

usersRouter.delete(
    '/:id',
    ...adminAuthValidator,
    ...usersValidators.deleteUserRequest,
    usersController.deleteUser
);
