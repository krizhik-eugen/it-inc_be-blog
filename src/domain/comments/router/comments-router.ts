import { Router } from 'express';
import { commentsController } from '../controller';
import { userAuthValidator } from '../../../app/middlewares';
import { commentsValidators } from '../middlewares/comments-request-validator';
import { routersPaths } from '../../../app/configs';

export const commentsRouter = Router();

commentsRouter
    .route(routersPaths.comments.id)
    .get(...commentsValidators.getCommentRequest, commentsController.getComment)
    .put(
        userAuthValidator,
        ...commentsValidators.updateCommentRequest,
        commentsController.updateComment
    )
    .delete(
        userAuthValidator,
        ...commentsValidators.deleteCommentRequest,
        commentsController.deleteComment
    );
