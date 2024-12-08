import { Router } from 'express';
import { postsController } from '../controller';
import { adminAuthValidator, userAuthValidator } from '../../app-middlewares';
import { postsValidators } from '../middlewares';

export const postsRouter = Router();

postsRouter.get(
    '/',
    ...postsValidators.getPostsRequest,
    postsController.getAllPosts
);

postsRouter.get(
    '/:id',
    ...postsValidators.getPostRequest,
    postsController.getPost
);

postsRouter.get(
    '/:id/comments',
    ...postsValidators.getPostCommentsRequest,
    postsController.getPostComments
);

postsRouter.post(
    '/',
    ...adminAuthValidator,
    ...postsValidators.createNewPostRequest,
    postsController.createNewPost
);

postsRouter.post(
    '/:id/comments',
    userAuthValidator,
    ...postsValidators.createNewCommentForPostRequest,
    postsController.createNewCommentForPost
);

postsRouter.put(
    '/:id',
    ...adminAuthValidator,
    ...postsValidators.updatePostRequest,
    postsController.updatePost
);

postsRouter.delete(
    '/:id',
    ...adminAuthValidator,
    ...postsValidators.deletePostRequest,
    postsController.deletePost
);
