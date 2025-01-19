import { inject, injectable } from 'inversify';
import { BlogsRepository } from '../blogs/infrastructure/blogs-repository';
import { PostsRepository } from '../posts/posts-repository';
import { UsersRepository } from '../users/infrastructure/users-repository';
import { CommentsRepository } from '../comments/comments-repository';
import { SessionsRepository } from '../security/infrastructure/sessions-repository';

@injectable()
export class TestingService {
    constructor(
        @inject(BlogsRepository) protected blogsRepository: BlogsRepository,
        @inject(PostsRepository) protected postsRepository: PostsRepository,
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(CommentsRepository)
        protected commentsRepository: CommentsRepository,
        @inject(SessionsRepository)
        protected sessionsRepository: SessionsRepository
    ) {}

    async deleteAllData() {
        await this.blogsRepository.deleteAllBlogs();
        await this.postsRepository.clearPosts();
        await this.usersRepository.deleteAllUsers();
        await this.commentsRepository.clearComments();
        await this.sessionsRepository.deleteAllSessions();
    }
}
