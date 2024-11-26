import { blogsRepository } from '../../blogs';
import { postsRepository } from '../../posts';

export const testingRepository = {
    async deleteAllData() {
        await blogsRepository.setBlogs([]);
        await postsRepository.setPosts([]);
    },
};
