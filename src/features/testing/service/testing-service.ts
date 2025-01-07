import { BlogsRepository } from '../../blogs';
import { CommentsRepository } from '../../comments';
import { PostsRepository } from '../../posts';
import { SessionsRepository } from '../../security';
import { UsersRepository } from '../../users';

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
