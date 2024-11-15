import { Request, Response } from "express";
import { blogsModel } from "../models";
import { HTTP_STATUS_CODES } from "../constants";

export const blogsController = {
    getAllBlogs(req: Request, res: Response) {
        const blogs = blogsModel.getAllBlogs();
        res.status(HTTP_STATUS_CODES.OK).json(blogs);
    },
    createNewBlog(req: Request, res: Response) {
        const createdBlog = blogsModel.addNewBlog(req.body);
        res.status(HTTP_STATUS_CODES.CREATED).json(createdBlog);
    },
    getBlog(req: Request, res: Response) {
        const foundBlog = blogsModel.getBlog(req.params.id);

        if (!foundBlog) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundBlog);
    },
    updateBlog(req: Request, res: Response) {
        const isBlogUpdated = blogsModel.updateBlog({ ...req.body, id: req.params.id });
        res.sendStatus(isBlogUpdated ? HTTP_STATUS_CODES.NO_CONTENT : HTTP_STATUS_CODES.NOT_FOUND);
    },
    deleteBlog(req: Request, res: Response) {
        const isBlogDeleted = blogsModel.deleteBlog(req.params.id);
        res.sendStatus(isBlogDeleted ? HTTP_STATUS_CODES.NO_CONTENT : HTTP_STATUS_CODES.NOT_FOUND);
    },
};
