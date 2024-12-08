import { Router } from 'express';
import { commentsController } from '../controller';
import { userAuthValidator } from '../../app-middlewares';
import { commentsValidators } from '../middlewares/comments-request-validator';

export const commentsRouter = Router();

commentsRouter.get(
    '/:id',
    ...commentsValidators.getCommentRequest,
    commentsController.getComment
);

commentsRouter.put(
    '/:id',
    userAuthValidator,
    ...commentsValidators.updateCommentRequest,
    commentsController.updateComment
);

commentsRouter.delete(
    '/:id',
    userAuthValidator,
    ...commentsValidators.deleteCommentRequest,
    commentsController.deleteComment
);
