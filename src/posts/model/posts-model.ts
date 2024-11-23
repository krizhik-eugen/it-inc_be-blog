import { MongoDBCollection } from '../../db';
import { TPost } from '../types';

const postsCollection = new MongoDBCollection<TPost>('posts');

export const postsModel = {
    async getAllPosts() {
        return (await postsCollection.getAllData()) as unknown as TPost[];
    },
    async addNewPost(newPost: Omit<TPost, 'id'>) {
        return (await postsCollection.addInstance(newPost)) as unknown as TPost;
    },
    async getPost(id: TPost['id']) {
        return (await postsCollection.getInstance(id)) as unknown as
            | TPost
            | undefined;
    },
    async updatePost(updatedPost: TPost) {
        return await postsCollection.updateInstance(updatedPost);
    },
    async deletePost(id: TPost['id']) {
        return await postsCollection.deleteInstance(id);
    },
    async deleteAllPosts() {
        await postsCollection.setDB([]);
    },
};
