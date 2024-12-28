import { Router } from 'express';
import { routersPaths } from '../../../app/configs';
import { adminAuthValidator } from '../../../app/middlewares';
import { usersController } from '../controller';
import { usersValidators } from '../middlewares';

export const usersRouter = Router();

usersRouter
    .route(routersPaths.users.main)
    .all(...adminAuthValidator)
    .get(...usersValidators.getUsersRequest, usersController.getAllUsers)
    .post(
        ...usersValidators.createNewUserRequest,
        usersController.createNewUser
    );

usersRouter
    .route(routersPaths.users.id)
    .delete(
        ...adminAuthValidator,
        ...usersValidators.deleteUserRequest,
        usersController.deleteUser
    );
