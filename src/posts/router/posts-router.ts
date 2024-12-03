import { Router } from 'express';
import { postsController } from '../controller';
import { authValidator } from '../../app-middlewares';
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
    ...authValidator,
    ...postsValidators.createNewPostRequest,
    postsController.createNewPost
);

postsRouter.put(
    '/:id',
    ...authValidator,
    ...postsValidators.updatePostRequest,
    postsController.updatePost
);

postsRouter.delete(
    '/:id',
    ...authValidator,
    ...postsValidators.deletePostRequest,
    postsController.deletePost
);
