import { Router } from 'express';
import { userAuthValidator } from '../../app/middlewares/user-auth-validator';
import { userAuthIdentifier } from '../../app/middlewares/user-auth-identifier';
import { container } from '../../app-composition-root';
import { routersPaths } from '../../app/configs/routes-config';
import { CommentsController } from './comments-controller';
import { commentsValidators } from './comments-request-validator';

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
