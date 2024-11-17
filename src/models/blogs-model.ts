import { Database } from '../db';
import { generateId } from '../utils';
import { TBlog } from './types';

const blogsDb = new Database<TBlog>();

export const blogsModel = {
    async getAllBlogs() {
        return await blogsDb.getAllData();
    },
    async addNewBlog(newBlog: Omit<TBlog, 'id'>) {
        return await blogsDb.addInstance({ id: generateId(), ...newBlog });
    },
    async getBlog(id: TBlog['id']) {
        return blogsDb.getInstance(id);
    },
    async updateBlog(updatedBlog: TBlog) {
        return await blogsDb.updateInstance(updatedBlog);
    },
    async deleteBlog(id: TBlog['id']) {
        return await blogsDb.deleteInstance(id);
    },
    async deleteAllBlogs() {
        await blogsDb.setDB([]);
    },
};
