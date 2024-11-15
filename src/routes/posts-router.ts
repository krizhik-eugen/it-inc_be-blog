import { Router } from 'express';
import { postsController } from '../controllers';
import { postsValidators } from '../middlewares';

export const postsRouter = Router();

postsRouter.get('/', postsController.getAllPosts);

postsRouter.post(
    '/',
    ...postsValidators.postRequest,
    postsController.createNewPost
);

postsRouter.get('/:id', postsController.getPost);

postsRouter.put(
    '/:id',
    ...postsValidators.putRequest,
    postsController.updatePost
);

postsRouter.delete('/:id', postsController.deletePost);
