import { Router } from 'express';
import { blogsController } from '../controller';
import { adminAuthValidator } from '../../../app/middlewares';
import { blogsValidators } from '../middlewares';
import { routersPaths } from '../../../app/configs';

export const blogsRouter = Router();

blogsRouter.get(
    routersPaths.blogs.main,
    ...blogsValidators.getBlogsRequest,
    blogsController.getBlogs
);

blogsRouter.get(
    routersPaths.blogs.id,
    ...blogsValidators.getBlogRequest,
    blogsController.getBlog
);

blogsRouter.get(
    routersPaths.blogs.idPosts,
    ...blogsValidators.getBlogPostsRequest,
    blogsController.getBlogPosts
);

blogsRouter.post(
    routersPaths.blogs.main,
    ...adminAuthValidator,
    ...blogsValidators.createNewBlogRequest,
    blogsController.createNewBlog
);

blogsRouter.post(
    routersPaths.blogs.idPosts,
    ...adminAuthValidator,
    ...blogsValidators.createNewPostForBlogRequest,
    blogsController.createNewPostForBlog
);

blogsRouter.put(
    routersPaths.blogs.id,
    ...adminAuthValidator,
    ...blogsValidators.updateBlogRequest,
    blogsController.updateBlog
);

blogsRouter.delete(
    routersPaths.blogs.id,
    ...adminAuthValidator,
    ...blogsValidators.deleteBlogRequest,
    blogsController.deleteBlog
);
