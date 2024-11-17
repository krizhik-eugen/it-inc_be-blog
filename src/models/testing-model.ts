import { blogsModel } from './blogs-model';
import { postsModel } from './posts-model';

export const testingModel = {
    async deleteAllData() {
        await blogsModel.deleteAllBlogs();
        await postsModel.deleteAllPosts();
    },
};
