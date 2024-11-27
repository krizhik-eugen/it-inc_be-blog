import { Router } from 'express';
import { blogsController } from '../controller';
import { authValidator, searchQueryParamsValidator } from '../../app-middlewares';
import { blogsValidators } from '../middlewares';

export const blogsRouter = Router();

blogsRouter.get(
    '/',
    ...searchQueryParamsValidator,
    ...blogsValidators.getBlogsRequest,
    blogsController.getAllBlogs
);

blogsRouter.get('/:id', ...blogsValidators.getBlogRequest, blogsController.getBlog);

blogsRouter.get('/:id/posts', 
    ...searchQueryParamsValidator,
    ...blogsValidators.getBlogRequest, 
    blogsController.getBlog
);

blogsRouter.post(
    '/',
    ...authValidator,
    ...blogsValidators.createNewBlogRequest,
    blogsController.createNewBlog
);


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
