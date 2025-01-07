import { Router } from 'express';
import { userAuthValidator } from '../../../app/middlewares';
import { commentsValidators } from '../middlewares/comments-request-validator';
import { routersPaths } from '../../../app/configs';
import { commentsController } from '../composition-root';

export const commentsRouter = Router();

commentsRouter
    .route(routersPaths.comments.id)
    .get(
        ...commentsValidators.getCommentRequest,
        commentsController.getComment.bind(commentsController)
    )
    .put(
        userAuthValidator,
        ...commentsValidators.updateCommentRequest,
        commentsController.updateComment.bind(commentsController)
    )
    .delete(
        userAuthValidator,
        ...commentsValidators.deleteCommentRequest,
        commentsController.deleteComment.bind(commentsController)
    );
