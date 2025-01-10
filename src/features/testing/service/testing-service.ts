import { BlogsRepository } from '../../blogs/repository';
import { CommentsRepository } from '../../comments/repository';
import { PostsRepository } from '../../posts/repository';
import { SessionsRepository } from '../../security/repository';
import { UsersRepository } from '../../users/repository';

export class TestingService {
    constructor(
        protected blogsRepository: BlogsRepository,
        protected postsRepository: PostsRepository,
        protected usersRepository: UsersRepository,
        protected commentsRepository: CommentsRepository,
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
