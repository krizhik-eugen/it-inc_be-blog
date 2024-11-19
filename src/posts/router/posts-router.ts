import { Router } from 'express';
import { postsController } from '../controller';
import { authValidator } from '../../app-middlewares';
import { postsValidators } from '../middlewares';

export const postsRouter = Router();

postsRouter.get('/', postsController.getAllPosts);

postsRouter.post(
    '/',
    ...authValidator,
    ...postsValidators.postRequest,
    postsController.createNewPost
);

postsRouter.get('/:id', postsController.getPost);

postsRouter.put(
    '/:id',
    ...authValidator,
    ...postsValidators.putRequest,
    postsController.updatePost
);

postsRouter.delete('/:id', ...authValidator, postsController.deletePost);
