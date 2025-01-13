import { Router } from 'express';
import { adminAuthValidator } from '../../../app/middlewares';
import { blogsValidators } from '../middlewares';
import { routersPaths } from '../../../app/configs';
import { userAuthIdentifier } from '../../../app/middlewares/auth';
import { BlogsController } from '../controller';
import { container } from '../../../app-composition-root';

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
        blogsController.deleteBlog.bind(blogsController)
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
