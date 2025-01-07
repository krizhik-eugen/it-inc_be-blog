import { usersRepository } from '../users';
import { postsRepository } from '../posts';
import { CommentsQueryRepository, CommentsRepository } from './repository';
import { CommentsService } from './service';
import { CommentsController } from './controller';

export const commentsQueryRepository = new CommentsQueryRepository();
export const commentsRepository = new CommentsRepository();

export const commentsService = new CommentsService(
    commentsRepository,
    usersRepository,
    postsRepository
);

export const commentsController = new CommentsController(
    commentsQueryRepository,
    commentsService
);
