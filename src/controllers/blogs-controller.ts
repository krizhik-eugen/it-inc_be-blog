import { Request, Response } from 'express';
import { blogsModel } from '../models';
import { HTTP_STATUS_CODES } from '../constants';

export const blogsController = {
    async getAllBlogs(req: Request, res: Response) {
        const blogs = await blogsModel.getAllBlogs();
        res.status(HTTP_STATUS_CODES.OK).json(blogs);
    },
    async createNewBlog(req: Request, res: Response) {
        const createdBlog = await blogsModel.addNewBlog(req.body);
        res.status(HTTP_STATUS_CODES.CREATED).json(createdBlog);
    },
    async getBlog(req: Request, res: Response) {
        const foundBlog = await blogsModel.getBlog(req.params.id);

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundBlog);
    },
    async updateBlog(req: Request, res: Response) {
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
    async deleteBlog(req: Request, res: Response) {
        const isBlogDeleted = await blogsModel.deleteBlog(req.params.id);
        res.sendStatus(
            isBlogDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
