import { ObjectId } from 'mongodb';
import { blogsRepository } from '../../blogs';
import { postsCollection, PostDBModel } from '../model';

export const postsRepository = {
    async getPostsCount(blogId = '') {
        return await postsCollection.countDocuments({
            blogId: { $regex: blogId ?? '', $options: 'i' },
        });
    },

    async findPostById(_id: PostDBModel['_id']) {
        return await postsCollection.findOne({ _id });
    },

    async addNewPost(newPost: PostDBModel) {
        const result = await postsCollection.insertOne(newPost);
        return result.insertedId.toString();
    },

    async updatePost(updatedPost: Partial<PostDBModel>) {
        const { _id, ...postToInsert } = updatedPost;
        const result = await postsCollection.updateOne(
            { _id },
            { $set: postToInsert }
        );
        return result.modifiedCount > 0;
    },

    async deletePost(_id: PostDBModel['_id']) {
        const result = await postsCollection.deleteOne({ _id });
        return result.deletedCount > 0;
    },

    async clearPosts() {
        await postsCollection.deleteMany({});
    },
};
