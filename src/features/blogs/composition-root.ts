import { PostsQueryRepository, PostsRepository, PostsService } from '../posts';
import { BlogsController } from './controller';
import { BlogsQueryRepository, BlogsRepository } from './repository';
import { BlogsService } from './service';

const blogsQueryRepository = new BlogsQueryRepository();
const blogsRepository = new BlogsRepository();
const postsQueryRepository = new PostsQueryRepository();
const postsRepository = new PostsRepository();

const postsService = new PostsService(postsRepository, blogsRepository);
const blogsService = new BlogsService(blogsRepository);

export const blogsController = new BlogsController(
    blogsQueryRepository,
    blogsService,
    postsQueryRepository,
    postsService
);
