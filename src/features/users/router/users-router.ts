import { Router } from 'express';
import { routersPaths } from '../../../app/configs';
import { usersValidators } from '../middlewares';
import { usersController } from '../composition-root';
import { adminAuthValidator } from '../../../app/middlewares/auth';

export const usersRouter = Router();

usersRouter
    .route(routersPaths.users.main)
    .all(...adminAuthValidator)
    .get(
        ...usersValidators.getUsersRequest,
        usersController.getAllUsers.bind(usersController)
    )
    .post(
        ...usersValidators.createNewUserRequest,
        usersController.createNewUser.bind(usersController)
    );

usersRouter
    .route(routersPaths.users.id)
    .delete(
        ...adminAuthValidator,
        ...usersValidators.deleteUserRequest,
        usersController.deleteUser.bind(usersController)
    );
