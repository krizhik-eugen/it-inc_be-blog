import { usersQueryRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../../constants';
import {
    TCreateNewUserRequest,
    TCreateNewUserResponse,
    TDeleteUserRequest,
    TGetAllUsersRequest,
    TGetAllUsersResponse,
} from '../types';
import { usersService } from '../service';
import { UsersDBSearchParams } from '../model';
import { createResponseError, getSearchQueries } from '../../../shared/helpers';
import { TResponseWithError } from '../../../shared/types';

export const usersController = {
    async getAllUsers(req: TGetAllUsersRequest, res: TGetAllUsersResponse) {
        const { searchLoginTerm, searchEmailTerm, ...restQueries } = req.query;
        const searchQueries =
            getSearchQueries<UsersDBSearchParams['sortBy']>(restQueries);
        const users = await usersQueryRepository.getUsers({
            searchQueries,
            searchLoginTerm,
            searchEmailTerm,
        });
        res.status(HTTP_STATUS_CODES.OK).json(users);
    },

    async createNewUser(
        req: TCreateNewUserRequest,
        res: TCreateNewUserResponse
    ) {
        const { login, email, password } = req.body;
        const result = await usersService.createNewUser({
            login,
            email,
            password,
        });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        const user = await usersQueryRepository.getUser(result.data.userId);
        if (!user) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('User is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(user);
    },

    async deleteUser(req: TDeleteUserRequest, res: TResponseWithError) {
        const result = await usersService.deleteUser(req.params.id);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },
};
