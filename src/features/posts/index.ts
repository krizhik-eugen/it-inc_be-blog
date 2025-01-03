import { postsController } from './controller';
import {
    postsValidators,
    postsQuerySchema,
    postsBodySchema,
} from './middlewares';
import { PostDBModel, PostsModel, PostsDBSearchParams } from './model';
import { postsRepository, postsQueryRepository } from './repository';
import { postsRouter } from './router';
import {
    PostViewModel,
    TGetAllPostsRequestQueries,
    PostCreateRequestModel,
    TGetAllPostCommentsRequest,
    TCreateNewPostCommentRequest,
} from './types';
import { postsService } from './service';

export {
    postsController,
    postsRepository,
    postsRouter,
    postsValidators,
    postsQuerySchema,
    PostViewModel,
    TGetAllPostsRequestQueries,
    PostCreateRequestModel,
    PostsDBSearchParams,
    PostDBModel,
    postsQueryRepository,
    postsBodySchema,
    postsService,
    TGetAllPostCommentsRequest,
    PostsModel,
    TCreateNewPostCommentRequest,
};
