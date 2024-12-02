import { blogsRepository } from '../../blogs';
import { postsRepository } from '../../posts';
import { usersRepository } from '../../users';

export const testingRepository = {
    async deleteAllData() {
        await blogsRepository.setBlogs([]);
        await postsRepository.setPosts([]);
        await usersRepository.setUsers([]);
    },
};
