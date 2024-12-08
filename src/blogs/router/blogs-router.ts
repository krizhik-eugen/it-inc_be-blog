import { Router } from 'express';
import { blogsController } from '../controller';
import { adminAuthValidator } from '../../app-middlewares';
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
    ...adminAuthValidator,
    ...blogsValidators.createNewBlogRequest,
    blogsController.createNewBlog
);

blogsRouter.post(
    '/:id/posts',
    ...adminAuthValidator,
    ...blogsValidators.createNewPostForBlogRequest,
    blogsController.createNewPostForBlog
);

blogsRouter.put(
    '/:id',
    ...adminAuthValidator,
    ...blogsValidators.updateBlogRequest,
    blogsController.updateBlog
);

blogsRouter.delete(
    '/:id',
    ...adminAuthValidator,
    ...blogsValidators.deleteBlogRequest,
    blogsController.deleteBlog
);
