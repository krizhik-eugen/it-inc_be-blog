import { CommentsQueryRepository, CommentsRepository } from './repository';
import { CommentsService } from './service';
import { CommentsController } from './controller';
import { UsersQueryRepository, UsersRepository } from '../users/repository';
import { PostsRepository } from '../posts/repository';
import { LikesQueryRepository, LikesRepository } from '../likes/repository';

const usersQueryRepository = new UsersQueryRepository();
const likesQueryRepository = new LikesQueryRepository(usersQueryRepository);
const likesRepository = new LikesRepository();
const commentsQueryRepository = new CommentsQueryRepository(
    likesQueryRepository
);
const commentsRepository = new CommentsRepository();
const usersRepository = new UsersRepository();
const postsRepository = new PostsRepository();

const commentsService = new CommentsService(
    commentsRepository,
    usersRepository,
    postsRepository,
    likesRepository
);

export const commentsController = new CommentsController(
    commentsQueryRepository,
    commentsService
);
