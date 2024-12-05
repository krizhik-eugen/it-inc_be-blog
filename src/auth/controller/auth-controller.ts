import { Response } from 'express';

import { HTTP_STATUS_CODES } from '../../constants';
import {
    TCreateNewUserRequest,
    TCreateNewUserResponse,
    TDeleteUserRequest,
    TGetAllUsersRequest,
    TGetAllUsersResponse,
} from '../types';
import { usersQueryRepository } from '../../users';

export const authController = {
    async login(req: TGetAllUsersRequest, res: TGetAllUsersResponse) {
        const usersResponse = await usersQueryRepository.getUsers(req);
        res.status(HTTP_STATUS_CODES.OK).json(usersResponse);
    },
};
