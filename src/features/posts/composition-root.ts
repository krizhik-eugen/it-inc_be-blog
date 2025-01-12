import { BlogsRepository } from '../blogs/repository';
import {
    CommentsQueryRepository,
    CommentsRepository,
} from '../comments/repository';
import { CommentsService } from '../comments/service';
import { LikesQueryRepository, LikesRepository } from '../likes/repository';
import { UsersQueryRepository, UsersRepository } from '../users/repository';
import { PostsController } from './controller';

import { PostsQueryRepository, PostsRepository } from './repository';
import { PostsService } from './service';

const usersRepository = new UsersRepository();
const usersQueryRepository = new UsersQueryRepository();
const likesQueryRepository = new LikesQueryRepository(usersQueryRepository);
const likesRepository = new LikesRepository();
const postsRepository = new PostsRepository();
const blogsRepository = new BlogsRepository();
const postsQueryRepository = new PostsQueryRepository(likesQueryRepository);
const commentsQueryRepository = new CommentsQueryRepository(
    likesQueryRepository
);
const commentsRepository = new CommentsRepository();

const postsService = new PostsService(
    postsRepository,
    blogsRepository,
    likesRepository
);
const commentsService = new CommentsService(
    commentsRepository,
    usersRepository,
    postsRepository,
    likesRepository
);

export const postsController = new PostsController(
    postsQueryRepository,
    postsService,
    commentsQueryRepository,
    commentsService
);
