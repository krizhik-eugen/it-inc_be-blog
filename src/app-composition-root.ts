import 'reflect-metadata';
import { Container } from 'inversify';
import { EmailManager } from './app/managers/email-manager';
import { RateLimiterRepository } from './app/repositories/rate-limiter-repository';
import { BlogsQueryRepository } from './features/blogs/blogs-query-repository';
import { CommentsQueryRepository } from './features/comments/comments-query-repository';
import { JwtService } from './app/services/jwt-service';
import { RateLimiterService } from './app/services/rate-limiter-service';
import { LikesQueryRepository } from './features/likes/likes-query-repository';
import { PostsQueryRepository } from './features/posts/posts-query-repository';
import { SessionsQueryRepository } from './features/security/infrastructure/sessions-query-repository';
import { UsersQueryRepository } from './features/users/infrastructure/users-query-repository';
import { BlogsRepository } from './features/blogs/blogs-repository';
import { CommentsRepository } from './features/comments/comments-repository';
import { LikesRepository } from './features/likes/likes-repository';
import { PostsRepository } from './features/posts/posts-repository';
import { SessionsRepository } from './features/security/infrastructure/sessions-repository';
import { UsersRepository } from './features/users/infrastructure/users-repository';
import { AuthService } from './features/auth/application/auth-service';
import { BlogsService } from './features/blogs/blogs-service';
import { CommentsService } from './features/comments/comments-service';
import { PostsService } from './features/posts/posts-service';
import { SessionService } from './features/security/application/session-service';
import { TestingService } from './features/testing/testing-service';
import { UsersService } from './features/users/application/users-service';
import { AuthController } from './features/auth/api/auth-controller';
import { BlogsController } from './features/blogs/blogs-controller';
import { CommentsController } from './features/comments/comments-controller';
import { PostsController } from './features/posts/posts-controller';
import { SecurityController } from './features/security/api/security-controller';
import { TestingController } from './features/testing/testing-controller';
import { UsersController } from './features/users/api/users-controller';

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
