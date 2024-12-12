import { blogsRepository } from '../../blogs';
import { postsRepository } from '../../posts';
import { usersRepository } from '../../users';

export const testingService = {
    async deleteAllData() {
        await blogsRepository.clearBlogs();
        await postsRepository.clearPosts();
        await usersRepository.clearUsers();
    },
};
