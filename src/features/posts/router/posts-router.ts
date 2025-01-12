import { Router } from 'express';
import {
    adminAuthValidator,
    userAuthValidator,
} from '../../../app/middlewares';
import { postsValidators } from '../middlewares';
import { routersPaths } from '../../../app/configs';
import { postsController } from '../composition-root';
import { userAuthIdentifier } from '../../../app/middlewares/auth';

export const postsRouter = Router();

postsRouter
    .route(routersPaths.posts.main)
    .get(
        userAuthIdentifier,
        ...postsValidators.getPostsRequest,
        postsController.getAllPosts.bind(postsController)
    )
    .post(
        ...adminAuthValidator,
        ...postsValidators.createNewPostRequest,
        postsController.createNewPost.bind(postsController)
    );

postsRouter
    .route(routersPaths.posts.id)
    .get(
        userAuthIdentifier,
        ...postsValidators.getPostRequest,
        postsController.getPost.bind(postsController)
    )
    .put(
        ...adminAuthValidator,
        ...postsValidators.updatePostRequest,
        postsController.updatePost.bind(postsController)
    )
    .delete(
        ...adminAuthValidator,
        ...postsValidators.deletePostRequest,
        postsController.deletePost.bind(postsController)
    );

postsRouter
    .route(routersPaths.posts.idComments)
    .get(
        userAuthIdentifier,
        ...postsValidators.getPostCommentsRequest,
        postsController.getPostComments.bind(postsController)
    )
    .post(
        userAuthValidator,
        ...postsValidators.createNewCommentForPostRequest,
        postsController.createNewCommentForPost.bind(postsController)
    );

postsRouter
    .route(routersPaths.posts.likeStatus)
    .put(
        userAuthValidator,
        ...postsValidators.updateLikeStatusRequest,
        postsController.updatePostLikeStatus.bind(postsController)
    );
