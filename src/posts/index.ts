import { postsController } from './controller';
import { postsValidators } from './middlewares';
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
    TCreateUpdatePostRequest,
    TGetDeleteDBInstanceRequest,
    TPost,
};
