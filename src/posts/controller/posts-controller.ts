import { Request, Response } from 'express';
import { postsRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../constants';
import {
    TCreateUpdatePostRequest,
    TGetDeleteDBInstanceRequest,
    TGetPostsResponse,
    TPost,
} from '../types';
import { postsService } from '../service/posts-service';

export const postsController = {
    async getAllPosts(req: Request, res: Response<TGetPostsResponse>) {
        const posts = await postsService.getPosts(req);
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    },

    async createNewPost(req: TCreateUpdatePostRequest, res: Response<TPost>) {
        const createdPost = await postsService.createNewPost(req);
        res.status(HTTP_STATUS_CODES.CREATED).json(createdPost);
    },

    async getPost(req: TGetDeleteDBInstanceRequest, res: Response<TPost>) {
        const foundPost = await postsRepository.getPost(req.params.id);

        if (!foundPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundPost);
    },

    async updatePost(req: TCreateUpdatePostRequest, res: Response) {
        const isPostUpdated = await postsRepository.updatePost({
            ...req.body,
            id: req.params.id,
        });
        res.sendStatus(
            isPostUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
    
    async deletePost(req: TGetDeleteDBInstanceRequest, res: Response) {
        const isPostDeleted = await postsRepository.deletePost(req.params.id);
        res.sendStatus(
            isPostDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
