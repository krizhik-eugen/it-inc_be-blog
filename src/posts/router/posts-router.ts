import { Router } from 'express';
import { postsController } from '../controller';
import { adminAuthValidator, userAuthValidator } from '../../app/middlewares';
import { postsValidators } from '../middlewares';
import { routersPaths } from '../../app/configs';

export const postsRouter = Router();

postsRouter.get(
    routersPaths.posts.main,
    ...postsValidators.getPostsRequest,
    postsController.getAllPosts
);

postsRouter.get(
    routersPaths.posts.id,
    ...postsValidators.getPostRequest,
    postsController.getPost
);

postsRouter.get(
    routersPaths.posts.idComments,
    ...postsValidators.getPostCommentsRequest,
    postsController.getPostComments
);

postsRouter.post(
    routersPaths.posts.main,
    ...adminAuthValidator,
    ...postsValidators.createNewPostRequest,
    postsController.createNewPost
);

postsRouter.post(
    routersPaths.posts.idComments,
    userAuthValidator,
    ...postsValidators.createNewCommentForPostRequest,
    postsController.createNewCommentForPost
);

postsRouter.put(
    routersPaths.posts.id,
    ...adminAuthValidator,
    ...postsValidators.updatePostRequest,
    postsController.updatePost
);

postsRouter.delete(
    routersPaths.posts.id,
    ...adminAuthValidator,
    ...postsValidators.deletePostRequest,
    postsController.deletePost
);
