import { blogsModel } from './blogs-model';
import { postsModel } from './posts-model';

export const testingModel = {
    deleteAllData() {
        blogsModel.deleteAllBlogs();
        postsModel.deleteAllPosts();
    },
};
