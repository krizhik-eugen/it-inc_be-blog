import {
    postsValidators,
    postsQuerySchema,
    postsBodySchema,
} from './middlewares';
import { PostDBModel, PostsModel, PostsDBSearchParams } from './model';
import { postsRouter } from './router';
import {
    PostViewModel,
    TGetAllPostsRequestQueries,
    PostCreateRequestModel,
    TGetAllPostCommentsRequest,
    TCreateNewPostCommentRequest,
} from './types';
import { PostsService } from './service';
import {
    postsController,
    postsQueryRepository,
    postsRepository,
    postsService,
} from './composition-root';
import { PostsQueryRepository, PostsRepository } from './repository';

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
    PostsService,
    PostsQueryRepository,
    PostsRepository,
};
