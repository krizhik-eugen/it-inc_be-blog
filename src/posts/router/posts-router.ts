import { Router } from 'express';
import { postsController } from '../controller';
import { authValidator } from '../../app-middlewares';
import { postsValidators } from '../middlewares';

export const postsRouter = Router();

postsRouter.get('/', postsController.getAllPosts);

postsRouter.post(
    '/',
    ...authValidator,
    ...postsValidators.createNewPostRequest,
    postsController.createNewPost
);

postsRouter.get('/:id', ...postsValidators.getPostRequest, postsController.getPost);

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
