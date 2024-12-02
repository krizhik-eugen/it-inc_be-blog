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

    async createNewUser(req: TCreateNewUserRequest, res: TCreateNewUserResponse) {
        const result = await usersService.createNewUser(req);
        if (result?.errorsMessages) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(result);
            return;
        }
        res.status(HTTP_STATUS_CODES.CREATED).json(result);
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
