import { Request, Response } from 'express';
import { blogsModel, postsModel, TPost } from '../models';
import { HTTP_STATUS_CODES } from '../constants';
import { TCreateUpdatePostRequest, TGetDeleteDBInstanceRequest } from './types';

export const postsController = {
    async getAllPosts(req: Request, res: Response<TPost[]>) {
        const posts = await postsModel.getAllPosts();
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    },
    async createNewPost(req: TCreateUpdatePostRequest, res: Response<TPost>) {
        const blog = await blogsModel.getBlog(req.body.blogId);
        const createdPost = await postsModel.addNewPost({
            ...req.body,
            blogName: blog?.name,
        });
        res.status(HTTP_STATUS_CODES.CREATED).json(createdPost);
    },
    async getPost(req: TGetDeleteDBInstanceRequest, res: Response<TPost>) {
        const foundPost = await postsModel.getPost(req.params.id);

        if (!foundPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundPost);
    },
    async updatePost(req: TCreateUpdatePostRequest, res: Response) {
        const isPostUpdated = await postsModel.updatePost({
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
        const isPostDeleted = await postsModel.deletePost(req.params.id);
        res.sendStatus(
            isPostDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
