import { LikesQueryRepository, LikesRepository } from '../likes/repository';
import { PostsQueryRepository, PostsRepository } from '../posts/repository';
import { PostsService } from '../posts/service';
import { UsersQueryRepository } from '../users/repository';
import { BlogsController } from './controller';
import { BlogsQueryRepository, BlogsRepository } from './repository';
import { BlogsService } from './service';

const usersQueryRepository = new UsersQueryRepository();
const likesQueryRepository = new LikesQueryRepository(usersQueryRepository);
const likesRepository = new LikesRepository();
const blogsQueryRepository = new BlogsQueryRepository();
const blogsRepository = new BlogsRepository();
const postsQueryRepository = new PostsQueryRepository(likesQueryRepository);
const postsRepository = new PostsRepository();

const postsService = new PostsService(
    postsRepository,
    blogsRepository,
    likesRepository
);
const blogsService = new BlogsService(blogsRepository);

export const blogsController = new BlogsController(
    blogsQueryRepository,
    blogsService,
    postsQueryRepository,
    postsService
);
