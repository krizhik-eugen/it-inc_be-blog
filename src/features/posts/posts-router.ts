import { Router } from 'express';
import { userAuthValidator } from '../../app/middlewares/user-auth-validator';

import { userAuthIdentifier } from '../../app/middlewares/user-auth-identifier';
import { container } from '../../app-composition-root';
import { PostsController } from './posts-controller';
import { routersPaths } from '../../app/configs/routes-config';
import { postsValidators } from './posts-request-validator';
import { adminAuthValidator } from '../../app/middlewares/admin-auth-validator';

export const postsRouter = Router();

const postsController = container.get(PostsController);

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
