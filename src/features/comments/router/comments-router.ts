import { Router } from 'express';
import { userAuthValidator } from '../../../app/middlewares';
import { commentsValidators } from '../middlewares/comments-request-validator';
import { routersPaths } from '../../../app/configs';
import { commentsController } from '../composition-root';
import { userAuthIdentifier } from '../../../app/middlewares/auth';

export const commentsRouter = Router();

commentsRouter
    .route(routersPaths.comments.id)
    .get(
        userAuthIdentifier,
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

commentsRouter
    .route(routersPaths.comments.likeStatus)
    .put(
        userAuthValidator,
        ...commentsValidators.updateLikeStatusRequest,
        commentsController.updateCommentLikeStatus.bind(commentsController)
    );
