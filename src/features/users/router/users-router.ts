import { Router } from 'express';
import { routersPaths } from '../../../app/configs';
import { usersValidators } from '../middlewares';
import { adminAuthValidator } from '../../../app/middlewares';
import { UsersController } from '../controller';
import { container } from '../../../app-composition-root';

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
