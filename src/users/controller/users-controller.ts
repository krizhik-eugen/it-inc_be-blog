import { Response } from 'express';
import { usersQueryRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../constants';
import {
    AllUsersResponseModel,
    TCreateNewUserRequest,
    TCreateNewUserResponse,
    TDeleteUserRequest,
    TGetAllUsersRequest,
} from '../types';
import { usersService } from '../service';


export const usersController = {
    async getAllUsers(req: TGetAllUsersRequest, res: Response<AllUsersResponseModel>) {
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

    // async getPost(req: TGetDeleteDBInstanceRequest, res: Response<TPost>) {
    //     const foundPost = await postsRepository.getPost(req.params.id);

    //     if (!foundPost) {
    //         res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
    //         return;
    //     }
    //     res.status(HTTP_STATUS_CODES.OK).json(foundPost);
    // },
    
    async deleteUser(req: TDeleteUserRequest, res: Response) {
        // const isPostDeleted = await postsRepository.deletePost(req.params.id);
        // res.sendStatus(
        //     isPostDeleted
        //         ? HTTP_STATUS_CODES.NO_CONTENT
        //         : HTTP_STATUS_CODES.NOT_FOUND
        // );
    },
};
