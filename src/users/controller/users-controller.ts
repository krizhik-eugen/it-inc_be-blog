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

export const usersController = {
    async getAllUsers(req: TGetAllUsersRequest, res: TGetAllUsersResponse) {
        const usersResponse = await usersQueryRepository.getUsers(req);
        res.status(HTTP_STATUS_CODES.OK).json(usersResponse);
    },

    async createNewUser(
        req: TCreateNewUserRequest,
        res: TCreateNewUserResponse
    ) {
        const result = await usersService.createNewUser(req);
        if (typeof result !== 'string' && result?.errorsMessages) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(result);
            return;
        }
        const addedUser = await usersQueryRepository.getUser(result as string);
        if (!addedUser) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json({
            id: addedUser._id.toString(),
            login: addedUser.login,
            email: addedUser.email,
            createdAt: addedUser.createdAt,
        });
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
