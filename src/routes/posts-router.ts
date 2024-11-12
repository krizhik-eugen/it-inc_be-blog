import { Router } from "express";
import { postsController } from "../controllers/posts-controller";

export const postsRouter = Router();

postsRouter.get('/', postsController.getAllPosts);
postsRouter.post('/', postsController.createNewPost);
postsRouter.get('/:id', postsController.getPost);
postsRouter.put('/:id', postsController.updatePost);
postsRouter.delete('/:id', postsController.deletePost);
