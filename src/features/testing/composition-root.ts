import { blogsRepository } from '../blogs';
import { commentsRepository } from '../comments';
import { postsRepository } from '../posts';
import { sessionsRepository } from '../security';
import { usersRepository } from '../users';
import { TestingController } from './controller';
import { TestingService } from './service';

export const testingService = new TestingService(
    blogsRepository,
    postsRepository,
    usersRepository,
    commentsRepository,
    sessionsRepository
);

export const testingController = new TestingController(testingService);
