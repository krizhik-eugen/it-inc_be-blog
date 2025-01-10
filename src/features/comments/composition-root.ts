import { CommentsQueryRepository, CommentsRepository } from './repository';
import { CommentsService } from './service';
import { CommentsController } from './controller';
import { UsersRepository } from '../users/repository';
import { PostsRepository } from '../posts/repository';

const commentsQueryRepository = new CommentsQueryRepository();
const commentsRepository = new CommentsRepository();
const usersRepository = new UsersRepository();
const postsRepository = new PostsRepository();

const commentsService = new CommentsService(
    commentsRepository,
    usersRepository,
    postsRepository
);

export const commentsController = new CommentsController(
    commentsQueryRepository,
    commentsService
);
