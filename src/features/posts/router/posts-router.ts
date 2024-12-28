import { Router } from 'express';
import { postsController } from '../controller';
import {
    adminAuthValidator,
    userAuthValidator,
} from '../../../app/middlewares';
import { postsValidators } from '../middlewares';
import { routersPaths } from '../../../app/configs';

export const postsRouter = Router();

postsRouter
    .route(routersPaths.posts.main)
    .get(...postsValidators.getPostsRequest, postsController.getAllPosts)
    .post(
        ...adminAuthValidator,
        ...postsValidators.createNewPostRequest,
        postsController.createNewPost
    );

postsRouter
    .route(routersPaths.posts.id)
    .get(...postsValidators.getPostRequest, postsController.getPost)
    .put(
        ...adminAuthValidator,
        ...postsValidators.updatePostRequest,
        postsController.updatePost
    )
    .delete(
        ...adminAuthValidator,
        ...postsValidators.deletePostRequest,
        postsController.deletePost
    );

postsRouter
    .route(routersPaths.posts.idComments)
    .get(
        ...postsValidators.getPostCommentsRequest,
        postsController.getPostComments
    )
    .post(
        userAuthValidator,
        ...postsValidators.createNewCommentForPostRequest,
        postsController.createNewCommentForPost
    );
