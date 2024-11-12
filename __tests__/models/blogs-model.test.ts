import { blogsModel } from '../../src/models/blogs-model';
import { TBlog } from '../../src/models/types';

describe('blogsModel', () => {
    beforeEach(() => {
        blogsModel.deleteAllBlogs();
    });

    const newBlog1: TBlog = {
        id: '1',
        name: 'Blog name 1',
        description: 'Short blog 1 description',
        websiteUrl: 'Blog 1 address'
    };
    const newBlog2: TBlog = {
        id: '2',
        name: 'Blog name 2',
        description: 'Short blog 2 description',
        websiteUrl: 'Blog 2 address'
    };

    it('getAllBlogs returns an empty array initially', () => {
        expect(blogsModel.getAllBlogs()).toEqual([]);
    });

    it('addNewBlog adds a new blog to the database', () => {
        const addedBlog = blogsModel.addNewBlog(newBlog1);
        expect(addedBlog).toHaveProperty('id');
        expect(blogsModel.getAllBlogs()).toEqual([addedBlog]);
    });

    it('getBlog returns a blog by id', () => {
        const addedBlog = blogsModel.addNewBlog(newBlog1);
        const retrievedBlog = blogsModel.getBlog(addedBlog.id);
        expect(retrievedBlog).toEqual(addedBlog);
    });

    it('updateBlog updates a blog in the database', () => {
        const addedBlog = blogsModel.addNewBlog(newBlog1);
        const updatedBlog = { ...addedBlog, title: 'Updated Blog 1' };
        blogsModel.updateBlog(updatedBlog);
        const retrievedBlog = blogsModel.getBlog(addedBlog.id);
        expect(retrievedBlog).toEqual(updatedBlog);
    });

    it('deleteBlog deletes a blog from the database', () => {
        const addedBlog = blogsModel.addNewBlog(newBlog1);
        blogsModel.deleteBlog(addedBlog.id);
        expect(blogsModel.getBlog(addedBlog.id)).toBeUndefined();
    });

    it('deleteAllBlogs deletes all blogs from the database', () => {
        blogsModel.addNewBlog(newBlog1);
        blogsModel.addNewBlog(newBlog2);
        blogsModel.deleteAllBlogs();
        expect(blogsModel.getAllBlogs()).toEqual([]);
    });
});
