import { Router } from 'express';
import { routersPaths } from '../../app/configs';
import { adminAuthValidator } from '../../app/middlewares';
import { usersController } from '../controller';
import { usersValidators } from '../middlewares';

export const usersRouter = Router();

usersRouter.get(
    routersPaths.users.main,
    ...adminAuthValidator,
    ...usersValidators.getUsersRequest,
    usersController.getAllUsers
);

usersRouter.post(
    routersPaths.users.main,
    ...adminAuthValidator,
    ...usersValidators.createNewUserRequest,
    usersController.createNewUser
);

usersRouter.delete(
    routersPaths.users.id,
    ...adminAuthValidator,
    ...usersValidators.deleteUserRequest,
    usersController.deleteUser
);
