import { Router } from 'express';
import { postsController } from '../controller';
import { adminAuthValidator } from '../../app-middlewares';
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

postsRouter.post(
    '/',
    ...adminAuthValidator,
    ...postsValidators.createNewPostRequest,
    postsController.createNewPost
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
