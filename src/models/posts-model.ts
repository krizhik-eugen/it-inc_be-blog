import { Database } from '../db/db';
import { generateId } from '../utils';
import { TPost } from './types';

const postsDb = new Database<TPost>();

export const postsModel = {
    getAllPosts() {
        return postsDb.getAllData();
    },
    addNewPost(newPost: Omit<TPost, 'id'>) {
        return postsDb.addInstance({ id: generateId(), ...newPost });
    },
    getPost(id: TPost['id']) {
        return postsDb.getInstance(id);
    },
    updatePost(updatedPost: TPost,) {
        return postsDb.updateInstance(updatedPost);
    },
    deletePost(id: TPost['id']) {
        return postsDb.deleteInstance(id);
    },
    deleteAllPosts() {
        postsDb.setDB([]);
    },
};
