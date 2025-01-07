import { PostsModel, PostDBModel } from '../model';

export class PostsRepository {
    async getPostsCount(blogId = '') {
        return await PostsModel.countDocuments({
            blogId: { $regex: blogId ?? '', $options: 'i' },
        });
    }

    async findPostById(id: string) {
        return await PostsModel.findById(id).lean();
    }

    async addNewPost(newPost: PostDBModel) {
        const result = await PostsModel.create(newPost);
        return result.id;
    }

    async updatePost(updatedPost: Partial<PostDBModel & { id: string }>) {
        const { id, ...postToInsert } = updatedPost;
        const result = await PostsModel.findByIdAndUpdate(id, postToInsert, {
            new: true,
        }).lean();
        return result;
    }

    async deletePost(id: string) {
        const result = await PostsModel.findByIdAndDelete(id).lean();
        return result;
    }

    async clearPosts() {
        const result = await PostsModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
