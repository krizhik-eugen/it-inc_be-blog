import {
    commentsValidators,
    commentsQuerySchema,
    commentsBodySchema,
} from './middlewares';
import { CommentDBModel, CommentsDBSearchParams } from './model';
import { commentsRouter } from './router';
import { CommentViewModel, CommentCreateRequestModel } from './types';
import { CommentsService } from './service';
import { CommentsQueryRepository, CommentsRepository } from './repository';
import {
    commentsController,
    commentsQueryRepository,
    commentsRepository,
    commentsService,
} from './composition-root';

export {
    commentsController,
    CommentsRepository,
    commentsRouter,
    commentsValidators,
    commentsQuerySchema,
    CommentViewModel,
    CommentCreateRequestModel,
    CommentsDBSearchParams,
    CommentDBModel,
    CommentsQueryRepository,
    commentsBodySchema,
    CommentsService,
    commentsQueryRepository,
    commentsService,
    commentsRepository,
};
