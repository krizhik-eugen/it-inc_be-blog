import { Router } from "express";
import { blogsController } from "../controllers/blogs-controller";

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getAllBlogs);
blogsRouter.post('/', blogsController.createNewBlog);
blogsRouter.get('/:id', blogsController.getBlog);
blogsRouter.put('/:id', blogsController.updateBlog);
blogsRouter.delete('/:id', blogsController.deleteBlog);
