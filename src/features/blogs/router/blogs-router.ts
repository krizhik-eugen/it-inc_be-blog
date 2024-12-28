import { Router } from 'express';
import { blogsController } from '../controller';
import { adminAuthValidator } from '../../../app/middlewares';
import { blogsValidators } from '../middlewares';
import { routersPaths } from '../../../app/configs';

export const blogsRouter = Router();

blogsRouter
    .route(routersPaths.blogs.main)
    .get(...blogsValidators.getBlogsRequest, blogsController.getBlogs)
    .post(
        ...adminAuthValidator,
        ...blogsValidators.createNewBlogRequest,
        blogsController.createNewBlog
    );

blogsRouter
    .route(routersPaths.blogs.id)
    .get(...blogsValidators.getBlogRequest, blogsController.getBlog)
    .put(
        ...adminAuthValidator,
        ...blogsValidators.updateBlogRequest,
        blogsController.updateBlog
    )
    .delete(
        ...adminAuthValidator,
        ...blogsValidators.deleteBlogRequest,
        blogsController.deleteBlog
    );

blogsRouter
    .route(routersPaths.blogs.idPosts)
    .get(...blogsValidators.getBlogPostsRequest, blogsController.getBlogPosts)
    .post(
        ...adminAuthValidator,
        ...blogsValidators.createNewPostForBlogRequest,
        blogsController.createNewPostForBlog
    );
