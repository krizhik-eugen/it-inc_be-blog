import { inject, injectable } from 'inversify';
import { BlogsRepository } from '../../blogs/repository';
import { CommentsRepository } from '../../comments/repository';
import { PostsRepository } from '../../posts/repository';
import { SessionsRepository } from '../../security/repository';
import { UsersRepository } from '../../users/repository';

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
        await this.blogsRepository.clearBlogs();
        await this.postsRepository.clearPosts();
        await this.usersRepository.clearUsers();
        await this.commentsRepository.clearComments();
        await this.sessionsRepository.clearSessions();
    }
}
