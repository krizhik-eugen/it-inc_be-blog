import { postsController } from './controller';
import { postsValidators } from './middlewares';
import { postsModel } from './model';
import { postsRouter } from './router';
import {
    TCreateUpdatePostRequest,
    TGetDeleteDBInstanceRequest,
    TPost,
} from './types';

export {
    postsController,
    postsModel,
    postsRouter,
    postsValidators,
    TCreateUpdatePostRequest,
    TGetDeleteDBInstanceRequest,
    TPost,
};
