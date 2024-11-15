import { Router } from 'express';
import { postsController } from '../controllers';
import { authValidator, postsValidators } from '../middlewares';

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
