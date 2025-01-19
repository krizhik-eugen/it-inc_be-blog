import { Router } from 'express';
import { container } from '../../../app-composition-root';
import { BlogsController } from './blogs-controller';
import { routersPaths } from '../../../app/configs/routes-config';
import { blogsValidators } from './validation/blogs-request-validator';
import { adminAuthValidator } from '../../../app/middlewares/admin-auth-validator';
import { userAuthIdentifier } from '../../../app/middlewares/user-auth-identifier';

export const blogsRouter = Router();

const blogsController = container.get(BlogsController);

blogsRouter
    .route(routersPaths.blogs.main)
    .get(
        ...blogsValidators.getBlogsRequest,
        blogsController.getBlogs.bind(blogsController)
    )
    .post(
        ...adminAuthValidator,
        ...blogsValidators.createNewBlogRequest,
        blogsController.createNewBlog.bind(blogsController)
    );

blogsRouter
    .route(routersPaths.blogs.id)
    .get(
        ...blogsValidators.getBlogRequest,
        blogsController.getBlog.bind(blogsController)
    )
    .put(
        ...adminAuthValidator,
        ...blogsValidators.updateBlogRequest,
        blogsController.updateBlog.bind(blogsController)
    )
    .delete(
        ...adminAuthValidator,
        ...blogsValidators.deleteBlogRequest,
        blogsController.deleteBlogById.bind(blogsController)
    );

blogsRouter
    .route(routersPaths.blogs.idPosts)
    .get(
        userAuthIdentifier,
        ...blogsValidators.getBlogPostsRequest,
        blogsController.getBlogPosts.bind(blogsController)
    )
    .post(
        ...adminAuthValidator,
        ...blogsValidators.createNewPostForBlogRequest,
        blogsController.createNewPostForBlog.bind(blogsController)
    );
