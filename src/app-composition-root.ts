import 'reflect-metadata';
import { Container } from 'inversify';
import { EmailManager } from './app/managers';
import { RateLimiterRepository } from './app/repositories';
import { JwtService, RateLimiterService } from './app/services';
import { AuthController } from './features/auth/controller';
import { AuthService } from './features/auth/service';
import { UsersService } from './features/users/service';
import {
    UsersQueryRepository,
    UsersRepository,
} from './features/users/repository';
import { UsersController } from './features/users/controller';
import { TestingService } from './features/testing/service';
import { TestingController } from './features/testing/controller';
import { SessionService } from './features/security/service';
import {
    SessionsQueryRepository,
    SessionsRepository,
} from './features/security/repository';
import { SecurityController } from './features/security/controller';
import { PostsService } from './features/posts/service';
import {
    PostsQueryRepository,
    PostsRepository,
} from './features/posts/repository';
import { PostsController } from './features/posts/controller';
import {
    LikesQueryRepository,
    LikesRepository,
} from './features/likes/repository';
import { CommentsService } from './features/comments/service';
import {
    CommentsQueryRepository,
    CommentsRepository,
} from './features/comments/repository';
import { CommentsController } from './features/comments/controller';
import { BlogsService } from './features/blogs/service';
import {
    BlogsQueryRepository,
    BlogsRepository,
} from './features/blogs/repository';
import { BlogsController } from './features/blogs/controller';

const container = new Container();

container.bind(EmailManager).to(EmailManager);
container.bind(RateLimiterRepository).to(RateLimiterRepository);
container.bind(JwtService).to(JwtService);
container.bind(RateLimiterService).to(RateLimiterService);

container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(LikesQueryRepository).to(LikesQueryRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(SessionsQueryRepository).to(SessionsQueryRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);

container.bind(BlogsRepository).to(BlogsRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(LikesRepository).to(LikesRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(SessionsRepository).to(SessionsRepository);
container.bind(UsersRepository).to(UsersRepository);

container.bind(AuthService).to(AuthService);
container.bind(BlogsService).to(BlogsService);
container.bind(CommentsService).to(CommentsService);
container.bind(PostsService).to(PostsService);
container.bind(SessionService).to(SessionService);
container.bind(TestingService).to(TestingService);
container.bind(UsersService).to(UsersService);

container.bind(AuthController).to(AuthController);
container.bind(BlogsController).to(BlogsController);
container.bind(CommentsController).to(CommentsController);
container.bind(PostsController).to(PostsController);
container.bind(SecurityController).to(SecurityController);
container.bind(TestingController).to(TestingController);
container.bind(UsersController).to(UsersController);

export { container };
