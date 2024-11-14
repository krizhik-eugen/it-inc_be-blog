import { Request, Response } from "express";
import { postsModel } from "../models/posts-model";
import { HTTP_STATUS_CODES } from "../constants";

export const postsController = {
    getAllPosts(req: Request, res: Response) {
        const posts = postsModel.getAllPosts();
        res.status(HTTP_STATUS_CODES.OK).json(posts);
    },
    createNewPost(req: Request, res: Response) {
        const createdPost = postsModel.addNewPost(req.body);
        res.status(HTTP_STATUS_CODES.CREATED).json(createdPost);
    },
    getPost(req: Request, res: Response) {
        const foundPost = postsModel.getPost(req.params.id);

        if (!foundPost) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundPost);
    },
    updatePost(req: Request, res: Response) {
        const isPostUpdated = postsModel.updatePost({ ...req.body, id: req.params.id });
        res.sendStatus(isPostUpdated ? HTTP_STATUS_CODES.NO_CONTENT : HTTP_STATUS_CODES.NOT_FOUND);
    },
    deletePost(req: Request, res: Response) {
        const isPostDeleted = postsModel.deletePost(req.params.id);
        res.sendStatus(isPostDeleted ? HTTP_STATUS_CODES.NO_CONTENT : HTTP_STATUS_CODES.NOT_FOUND);
    },
};
