import { blogsModel } from '../../blogs';
import { postsModel } from '../../posts';

export const testingModel = {
    async deleteAllData() {
        await blogsModel.deleteAllBlogs();
        await postsModel.deleteAllPosts();
    },
};
