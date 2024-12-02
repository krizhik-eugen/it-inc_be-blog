import { postsController } from './controller';
import { postsValidators, postsQuerySchema } from './middlewares';
import { postsRepository } from './repository';
import { postsRouter } from './router';
import {
    PostViewModel,
    TGetAllPostsRequestQueries,
    PostCreateRequestModel
} from './types';

export {
    postsController,
    postsRepository,
    postsRouter,
    postsValidators,
    postsQuerySchema,
    PostViewModel,
    TGetAllPostsRequestQueries,
    PostCreateRequestModel
};
