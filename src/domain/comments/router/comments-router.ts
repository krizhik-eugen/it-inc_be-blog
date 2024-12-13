import { Router } from 'express';
import { commentsController } from '../controller';
import { userAuthValidator } from '../../../app/middlewares';
import { commentsValidators } from '../middlewares/comments-request-validator';
import { routersPaths } from '../../../app/configs';

export const commentsRouter = Router();

commentsRouter.get(
    routersPaths.comments.id,
    ...commentsValidators.getCommentRequest,
    commentsController.getComment
);

commentsRouter.put(
    routersPaths.comments.id,
    userAuthValidator,
    ...commentsValidators.updateCommentRequest,
    commentsController.updateComment
);

commentsRouter.delete(
    routersPaths.comments.id,
    userAuthValidator,
    ...commentsValidators.deleteCommentRequest,
    commentsController.deleteComment
);
