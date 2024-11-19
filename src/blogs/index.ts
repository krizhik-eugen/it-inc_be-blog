import { blogsController } from './controller';
import { blogsValidators } from './middlewares';
import { blogsModel } from './model';
import { blogsRouter } from './router';
import {
    TBlog,
    TCreateUpdateBlogRequest,
    TGetDeleteDBInstanceRequest,
    TParam,
} from './types';

export {
    blogsController,
    blogsModel,
    blogsRouter,
    blogsValidators,
    TBlog,
    TCreateUpdateBlogRequest,
    TGetDeleteDBInstanceRequest,
    TParam,
};
