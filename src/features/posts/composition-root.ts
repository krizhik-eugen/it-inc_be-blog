import { blogsRepository } from '../blogs';
import { commentsQueryRepository, commentsService } from '../comments';
import { PostsController } from './controller';

import { PostsQueryRepository, PostsRepository } from './repository';
import { PostsService } from './service';

export const postsQueryRepository = new PostsQueryRepository();
export const postsRepository = new PostsRepository();

export const postsService = new PostsService(postsRepository, blogsRepository);

export const postsController = new PostsController(
    postsQueryRepository,
    postsService,
    commentsQueryRepository,
    commentsService
);
