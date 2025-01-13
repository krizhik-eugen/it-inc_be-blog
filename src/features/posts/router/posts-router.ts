import { Router } from 'express';
import {
    adminAuthValidator,
    userAuthValidator,
} from '../../../app/middlewares';
import { postsValidators } from '../middlewares';
import { routersPaths } from '../../../app/configs';
import { userAuthIdentifier } from '../../../app/middlewares/auth';
import { PostsController } from '../controller';
import { container } from '../../../app-composition-root';

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
