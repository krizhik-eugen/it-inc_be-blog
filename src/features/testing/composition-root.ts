import { BlogsRepository } from '../blogs';
import { CommentsRepository } from '../comments';
import { PostsRepository } from '../posts';
import { SessionsRepository } from '../security';
import { UsersRepository } from '../users';
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
