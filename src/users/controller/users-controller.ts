import { Response } from 'express';
import { usersQueryRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../constants';
import {
    TCreateNewUserRequest,
    TCreateNewUserResponse,
    TDeleteUserRequest,
    TGetAllUsersRequest,
    TGetAllUsersResponse,
} from '../types';
import { usersService } from '../service';
import { UsersDBSearchParams } from '../model';
import { getSearchQueries } from '../../helpers';

export const usersController = {
    async getAllUsers(req: TGetAllUsersRequest, res: TGetAllUsersResponse) {
        const { searchLoginTerm, searchEmailTerm, ...restQueries } = req.query;
        const searchQueries =
            getSearchQueries<UsersDBSearchParams['sortBy']>(restQueries);

        const usersResponse = await usersQueryRepository.getUsers({
            searchQueries,
            searchLoginTerm,
            searchEmailTerm,
        });
        res.status(HTTP_STATUS_CODES.OK).json(usersResponse);
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
        if (typeof result !== 'string' && 'errorsMessages' in result) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(result);
            return;
        }
        const addedUser = await usersQueryRepository.getUser(result);
        if (!addedUser) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(addedUser);
    },

    async deleteUser(req: TDeleteUserRequest, res: Response) {
        const isUserDeleted = await usersService.deleteUser(req.params.id);
        res.sendStatus(
            isUserDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
