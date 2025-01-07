import { postsQueryRepository, postsService } from '../posts';
import { BlogsController } from './controller';
import { BlogsQueryRepository, BlogsRepository } from './repository';
import { BlogsService } from './service';

export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsRepository = new BlogsRepository();

export const blogsService = new BlogsService(blogsRepository);

export const blogsController = new BlogsController(
    blogsQueryRepository,
    blogsService,
    postsQueryRepository,
    postsService
);
