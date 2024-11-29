import { postsController } from './controller';
import { postsValidators, postsQuerySchema } from './middlewares';
import { postsRepository } from './repository';
import { postsRouter } from './router';
import {
    TCreateUpdatePostRequest,
    TGetDeleteDBInstanceRequest,
    TPost,
} from './types';

export {
    postsController,
    postsRepository,
    postsRouter,
    postsValidators,
    postsQuerySchema,
    TCreateUpdatePostRequest,
    TGetDeleteDBInstanceRequest,
    TPost,
};
