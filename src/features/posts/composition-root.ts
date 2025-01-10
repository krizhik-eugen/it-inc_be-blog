import { BlogsRepository } from '../blogs/repository';
import {
    CommentsQueryRepository,
    CommentsRepository,
} from '../comments/repository';
import { CommentsService } from '../comments/service';
import { UsersRepository } from '../users/repository';
import { PostsController } from './controller';

import { PostsQueryRepository, PostsRepository } from './repository';
import { PostsService } from './service';
const postsQueryRepository = new PostsQueryRepository();
const postsRepository = new PostsRepository();
const blogsRepository = new BlogsRepository();
const commentsQueryRepository = new CommentsQueryRepository();
const commentsRepository = new CommentsRepository();
const usersRepository = new UsersRepository();

const postsService = new PostsService(postsRepository, blogsRepository);
const commentsService = new CommentsService(
    commentsRepository,
    usersRepository,
    postsRepository
);

export const postsController = new PostsController(
    postsQueryRepository,
    postsService,
    commentsQueryRepository,
    commentsService
);
