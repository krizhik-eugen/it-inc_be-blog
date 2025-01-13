import { Router } from 'express';
import { userAuthValidator } from '../../../app/middlewares';
import { commentsValidators } from '../middlewares/comments-request-validator';
import { routersPaths } from '../../../app/configs';
import { userAuthIdentifier } from '../../../app/middlewares/auth';
import { container } from '../../../app-composition-root';
import { CommentsController } from '../controller';

export const commentsRouter = Router();

const commentsController = container.get(CommentsController);

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
