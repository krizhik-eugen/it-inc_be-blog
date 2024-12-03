import { postsController } from './controller';
import { postsValidators, postsQuerySchema } from './middlewares';
import { PostDBModel, PostsDBSearchParams } from './model';
import { postsRepository, postsQueryRepository } from './repository';
import { postsRouter } from './router';
import {
    PostViewModel,
    TGetAllPostsRequestQueries,
    PostCreateRequestModel
} from './types';
import { postsBodySchema } from './middlewares';

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
    postsBodySchema
};
