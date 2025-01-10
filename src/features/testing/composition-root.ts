import { BlogsRepository } from '../blogs/repository';
import { CommentsRepository } from '../comments/repository';
import { PostsRepository } from '../posts/repository';
import { SessionsRepository } from '../security/repository';
import { UsersRepository } from '../users/repository';
import { TestingController } from './controller';
import { TestingService } from './service';

const commentsRepository = new CommentsRepository();
const postsRepository = new PostsRepository();
const sessionsRepository = new SessionsRepository();
const usersRepository = new UsersRepository();
const blogsRepository = new BlogsRepository();

const testingService = new TestingService(
    blogsRepository,
    postsRepository,
    usersRepository,
    commentsRepository,
    sessionsRepository
);

export const testingController = new TestingController(testingService);
