import { blogsRepository } from '../../blogs';
import { commentsRepository } from '../../comments';
import { postsRepository } from '../../posts';
import { sessionsRepository } from '../../security';
import { usersRepository } from '../../users';

export const testingService = {
    async deleteAllData() {
        await blogsRepository.clearBlogs();
        await postsRepository.clearPosts();
        await usersRepository.clearUsers();
        await commentsRepository.clearComments();
        await sessionsRepository.clearSessions();
    },
};
