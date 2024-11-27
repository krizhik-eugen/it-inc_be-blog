import { Router } from 'express';
import { blogsController } from '../controller';
import { authValidator } from '../../app-middlewares';
import { blogsValidators } from '../middlewares';

export const blogsRouter = Router();

blogsRouter.get('/', blogsController.getAllBlogs);

blogsRouter.post(
    '/',
    ...authValidator,
    ...blogsValidators.createNewBlogRequest,
    blogsController.createNewBlog
);

blogsRouter.get('/:id', ...blogsValidators.getBlogRequest, blogsController.getBlog);

blogsRouter.put(
    '/:id',
    ...authValidator,
    ...blogsValidators.updateBlogRequest,
    blogsController.updateBlog
);

blogsRouter.delete(
    '/:id',
    ...authValidator,
    ...blogsValidators.deleteBlogRequest,
    blogsController.deleteBlog
);
