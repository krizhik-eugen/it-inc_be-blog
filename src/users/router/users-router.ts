import { Router } from 'express';
import { usersController } from '../controller';
import { authValidator } from '../../app-middlewares';
import { postsValidators } from '../middlewares';

export const usersRouter = Router();

usersRouter.get(
    '/',
    ...authValidator,
    ...postsValidators.getUsersRequest,
    usersController.getAllUsers
);

usersRouter.post(
    '/',
    ...authValidator,
    ...postsValidators.createNewUserRequest,
    usersController.createNewUser
);

usersRouter.delete(
    '/:id',
    ...authValidator,
    ...postsValidators.deleteUserRequest,
    usersController.deleteUser
);
