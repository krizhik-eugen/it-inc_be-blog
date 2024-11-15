import { Database } from '../db';
import { generateId } from '../utils';
import { TBlog } from './types';

const blogsDb = new Database<TBlog>();

export const blogsModel = {
    getAllBlogs() {
        return blogsDb.getAllData();
    },
    addNewBlog(newBlog: Omit<TBlog, 'id'>) {
        return blogsDb.addInstance({ id: generateId(), ...newBlog });
    },
    getBlog(id: TBlog['id']) {
        return blogsDb.getInstance(id);
    },
    updateBlog(updatedBlog: TBlog) {
        return blogsDb.updateInstance(updatedBlog);
    },
    deleteBlog(id: TBlog['id']) {
        return blogsDb.deleteInstance(id);
    },
    deleteAllBlogs() {
        blogsDb.setDB([]);
    },
};
