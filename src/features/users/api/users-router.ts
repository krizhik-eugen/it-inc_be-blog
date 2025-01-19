import { Router } from 'express';
import { routersPaths } from '../../../app/configs/routes-config';
import { adminAuthValidator } from '../../../app/middlewares/admin-auth-validator';
import { container } from '../../../app-composition-root';
import { UsersController } from './users-controller';
import { usersValidators } from './validation/users-request-validator';

export const usersRouter = Router();

const usersController = container.get(UsersController);

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
