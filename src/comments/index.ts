import { commentsController } from './controller';
import {
    commentsValidators,
    commentsQuerySchema,
    commentsBodySchema,
} from './middlewares';
import { CommentDBModel, CommentsDBSearchParams } from './model';
import { commentsRepository, commentsQueryRepository } from './repository';
import { commentsRouter } from './router';
import { CommentViewModel, CommentCreateRequestModel } from './types';
import { commentsService } from './service';

export {
    commentsController,
    commentsRepository,
    commentsRouter,
    commentsValidators,
    commentsQuerySchema,
    CommentViewModel,
    CommentCreateRequestModel,
    CommentsDBSearchParams,
    CommentDBModel,
    commentsQueryRepository,
    commentsBodySchema,
    commentsService,
};
