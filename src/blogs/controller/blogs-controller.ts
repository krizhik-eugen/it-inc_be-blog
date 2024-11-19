import { Request, Response } from 'express';
import { blogsModel } from '../model';
import { HTTP_STATUS_CODES } from '../../constants';
import {
    TBlog,
    TCreateUpdateBlogRequest,
    TGetDeleteDBInstanceRequest,
} from '../types';

export const blogsController = {
    async getAllBlogs(req: Request, res: Response<TBlog[]>) {
        const blogs = await blogsModel.getAllBlogs();
        res.status(HTTP_STATUS_CODES.OK).json(blogs);
    },
    async createNewBlog(req: TCreateUpdateBlogRequest, res: Response<TBlog>) {
        const createdBlog = await blogsModel.addNewBlog(req.body);
        res.status(HTTP_STATUS_CODES.CREATED).json(createdBlog);
    },
    async getBlog(req: TGetDeleteDBInstanceRequest, res: Response<TBlog>) {
        const foundBlog = await blogsModel.getBlog(req.params.id);

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundBlog);
    },
    async updateBlog(req: TCreateUpdateBlogRequest, res: Response) {
        const isBlogUpdated = await blogsModel.updateBlog({
            ...req.body,
            id: req.params.id,
        });
        res.sendStatus(
            isBlogUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
    async deleteBlog(req: TGetDeleteDBInstanceRequest, res: Response) {
        const isBlogDeleted = await blogsModel.deleteBlog(req.params.id);
        res.sendStatus(
            isBlogDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
