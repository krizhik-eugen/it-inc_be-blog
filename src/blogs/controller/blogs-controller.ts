import { Request, Response } from 'express';
import { blogsRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../constants';
import {
    TBlog,
    TCreateUpdateBlogRequest,
    TGetDeleteDBInstanceRequest,
} from '../types';

export const blogsController = {
    async getAllBlogs(req: Request, res: Response<TBlog[]>) {
        const blogs = await blogsRepository.getAllBlogs();
        res.status(HTTP_STATUS_CODES.OK).json(blogs);
    },
    async createNewBlog(req: TCreateUpdateBlogRequest, res: Response<TBlog>) {
        const createdBlog = await blogsRepository.addNewBlog({
            ...req.body,
        });
        res.status(HTTP_STATUS_CODES.CREATED).json(createdBlog);
    },
    async getBlog(req: TGetDeleteDBInstanceRequest, res: Response<TBlog>) {
        const foundBlog = await blogsRepository.getBlog(req.params.id);

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundBlog);
    },
    async updateBlog(req: TCreateUpdateBlogRequest, res: Response) {
        const isBlogUpdated = await blogsRepository.updateBlog({
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
        const isBlogDeleted = await blogsRepository.deleteBlog(req.params.id);
        res.sendStatus(
            isBlogDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
