import { Database } from '../db';
import { generateId } from '../utils';
import { TPost } from './types';

const postsDb = new Database<TPost>();

export const postsModel = {
    async getAllPosts() {
        return await postsDb.getAllData();
    },
    async addNewPost(newPost: Omit<TPost, 'id'>) {
        return await postsDb.addInstance({ id: generateId(), ...newPost });
    },
    async getPost(id: TPost['id']) {
        return await postsDb.getInstance(id);
    },
    async updatePost(updatedPost: TPost) {
        return await postsDb.updateInstance(updatedPost);
    },
    async deletePost(id: TPost['id']) {
        return await postsDb.deleteInstance(id);
    },
    async deleteAllPosts() {
        await postsDb.setDB([]);
    },
};
