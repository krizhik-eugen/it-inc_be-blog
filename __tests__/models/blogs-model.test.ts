import { blogsModel, TBlog } from '../../src/models';

describe('blogsModel', () => {
    beforeEach(async () => {
        await blogsModel.deleteAllBlogs();
    });

    const newBlog1: TBlog = {
        id: '1',
        name: 'Blog name 1',
        description: 'Short blog 1 description',
        websiteUrl: 'Blog 1 address',
    };
    const newBlog2: TBlog = {
        id: '2',
        name: 'Blog name 2',
        description: 'Short blog 2 description',
        websiteUrl: 'Blog 2 address',
    };

    it('getAllBlogs returns an empty array initially', async () => {
        expect(await blogsModel.getAllBlogs()).toEqual([]);
    });

    it('addNewBlog adds a new blog to the database', async () => {
        const addedBlog = await blogsModel.addNewBlog(newBlog1);
        expect(addedBlog).toHaveProperty('id');
        expect(await blogsModel.getAllBlogs()).toEqual([addedBlog]);
    });

    it('getBlog returns a blog by id', async () => {
        const addedBlog = await blogsModel.addNewBlog(newBlog1);
        const retrievedBlog = await blogsModel.getBlog(addedBlog.id);
        expect(retrievedBlog).toEqual(addedBlog);
    });

    it('updateBlog updates a blog in the database', async () => {
        const addedBlog = await blogsModel.addNewBlog(newBlog1);
        const updatedBlog = { ...addedBlog, title: 'Updated Blog 1' };
        await blogsModel.updateBlog(updatedBlog);
        const retrievedBlog = await blogsModel.getBlog(addedBlog.id);
        expect(retrievedBlog).toEqual(updatedBlog);
    });

    it('deleteBlog deletes a blog from the database', async () => {
        const addedBlog = await blogsModel.addNewBlog(newBlog1);
        await blogsModel.deleteBlog(addedBlog.id);
        expect(await blogsModel.getBlog(addedBlog.id)).toBeUndefined();
    });

    it('deleteAllBlogs deletes all blogs from the database', async () => {
        await blogsModel.addNewBlog(newBlog1);
        await blogsModel.addNewBlog(newBlog2);
        await blogsModel.deleteAllBlogs();
        expect(await blogsModel.getAllBlogs()).toEqual([]);
    });
});
