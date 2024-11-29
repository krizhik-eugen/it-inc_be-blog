import { Router } from 'express';
import { blogsController } from '../controller';
import {
    authValidator,
} from '../../app-middlewares';
import { blogsValidators } from '../middlewares';

export const blogsRouter = Router();

blogsRouter.get(
    '/',
    ...blogsValidators.getBlogsRequest,
    blogsController.getBlogs
);

blogsRouter.get(
    '/:id',
    ...blogsValidators.getBlogRequest,
    blogsController.getBlog
);

blogsRouter.get(
    '/:id/posts',
    ...blogsValidators.getBlogPostsRequest,
    blogsController.getBlogPosts
);

blogsRouter.post(
    '/',
    ...authValidator,
    ...blogsValidators.createNewBlogRequest,
    blogsController.createNewBlog
);

blogsRouter.post(
    '/:id/posts',
    ...authValidator,
    ...blogsValidators.createNewPostForBlogRequest,
    blogsController.createNewPostForBlog
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
