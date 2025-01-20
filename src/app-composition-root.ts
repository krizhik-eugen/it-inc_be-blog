import 'reflect-metadata';
import { Container } from 'inversify';
import { EmailManager } from './app/managers/email-manager';
import { RateLimiterRepository } from './app/repositories/rate-limiter-repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments-query-repository';
import { JwtService } from './app/services/jwt-service';
import { RateLimiterService } from './app/services/rate-limiter-service';
import { LikesQueryRepository } from './features/likes/infrastructure/likes-query-repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts-query-repository';
import { SessionsQueryRepository } from './features/security/infrastructure/sessions-query-repository';
import { UsersQueryRepository } from './features/users/infrastructure/users-query-repository';
import { BlogsRepository } from './features/blogs/infrastructure/blogs-repository';
import { CommentsRepository } from './features/comments/infrastructure/comments-repository';
import { LikesRepository } from './features/likes/infrastructure/likes-repository';
import { PostsRepository } from './features/posts/infrastructure/posts-repository';
import { SessionsRepository } from './features/security/infrastructure/sessions-repository';
import { UsersRepository } from './features/users/infrastructure/users-repository';
import { AuthService } from './features/auth/application/auth-service';
import { BlogsService } from './features/blogs/application/blogs-service';
import { CommentsService } from './features/comments/application/comments-service';
import { PostsService } from './features/posts/application/posts-service';
import { SessionService } from './features/security/application/session-service';
import { TestingService } from './features/testing/testing-service';
import { UsersService } from './features/users/application/users-service';
import { AuthController } from './features/auth/api/auth-controller';
import { BlogsController } from './features/blogs/api/blogs-controller';
import { CommentsController } from './features/comments/api/comments-controller';
import { PostsController } from './features/posts/api/posts-controller';
import { SecurityController } from './features/security/api/security-controller';
import { TestingController } from './features/testing/testing-controller';
import { UsersController } from './features/users/api/users-controller';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs-query-repository';

const container = new Container();

container.bind(EmailManager).toSelf();
container.bind(RateLimiterRepository).toSelf();
container.bind(JwtService).toSelf();
container.bind(RateLimiterService).toSelf();

container.bind(BlogsQueryRepository).toSelf();
container.bind(CommentsQueryRepository).toSelf();
container.bind(LikesQueryRepository).toSelf();
container.bind(PostsQueryRepository).toSelf();
container.bind(SessionsQueryRepository).toSelf();
container.bind(UsersQueryRepository).toSelf();

container.bind(BlogsRepository).toSelf();
container.bind(CommentsRepository).toSelf();
container.bind(LikesRepository).toSelf();
container.bind(PostsRepository).toSelf();
container.bind(SessionsRepository).toSelf();
container.bind(UsersRepository).toSelf();

container.bind(AuthService).toSelf();
container.bind(BlogsService).toSelf();
container.bind(CommentsService).toSelf();
container.bind(PostsService).toSelf();
container.bind(SessionService).toSelf();
container.bind(TestingService).toSelf();
container.bind(UsersService).toSelf();

container.bind(AuthController).toSelf();
container.bind(BlogsController).toSelf();
container.bind(CommentsController).toSelf();
container.bind(PostsController).toSelf();
container.bind(SecurityController).toSelf();
container.bind(TestingController).toSelf();
container.bind(UsersController).toSelf();

export { container };
