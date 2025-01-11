import { BlogsRepository } from '../blogs/repository';
import {
    CommentsQueryRepository,
    CommentsRepository,
} from '../comments/repository';
import { CommentsService } from '../comments/service';
import { LikesQueryRepository, LikesRepository } from '../likes/repository';
import { UsersRepository } from '../users/repository';
import { PostsController } from './controller';

import { PostsQueryRepository, PostsRepository } from './repository';
import { PostsService } from './service';

const postsQueryRepository = new PostsQueryRepository();
const postsRepository = new PostsRepository();
const blogsRepository = new BlogsRepository();
const likesQueryRepository = new LikesQueryRepository();
const likesRepository = new LikesRepository();
const commentsQueryRepository = new CommentsQueryRepository(
    likesQueryRepository
);
const commentsRepository = new CommentsRepository();
const usersRepository = new UsersRepository();

const postsService = new PostsService(postsRepository, blogsRepository);
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
