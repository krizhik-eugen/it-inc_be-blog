import { MongoDBCollection } from '../../db';
import { TBlog } from '../types';

const blogsCollection = new MongoDBCollection<TBlog>('blogs');

export const blogsModel = {
    async getAllBlogs() {
        return await blogsCollection.getAllData() as unknown as TBlog[];
    },
    async addNewBlog(newBlog: Omit<TBlog, 'id' | 'createdAt'>){
        return await blogsCollection.addInstance(newBlog) as unknown as TBlog;
    },
    async getBlog(id: TBlog['id']) {
        return blogsCollection.getInstance(id) as unknown as TBlog | undefined;
    },
    async updateBlog(updatedBlog: TBlog) {
        return await blogsCollection.updateInstance(updatedBlog);
    },
    async deleteBlog(id: TBlog['id']) {
        return await blogsCollection.deleteInstance(id);
    },
    async deleteAllBlogs() {
        await blogsCollection.setDB([]);
    },
};
