import { blogsCollection, BlogDBModel } from '../model';

export const blogsRepository = {
    async getBlogsCount(findName = '') {
        return await blogsCollection.countDocuments({
            name: { $regex: findName, $options: 'i' },
        });
    },

    async addNewBlog(newBlog: BlogDBModel) {
        const result = await blogsCollection.insertOne(newBlog);
        return result.insertedId.toString();
    },

    async findBlogById(_id: BlogDBModel['_id']) {
        return await blogsCollection.findOne({ _id });
    },

    async updateBlog(updatedBlog: Partial<BlogDBModel>) {
        const { _id, ...blogToUpdate } = updatedBlog;
        const result = await blogsCollection.updateOne(
            { _id },
            { $set: blogToUpdate }
        );
        return result.modifiedCount > 0;
    },

    async deleteBlog(_id: BlogDBModel['_id']) {
        const result = await blogsCollection.deleteOne({ _id });
        return result.deletedCount > 0;
    },

    async clearBlogs() {
        await blogsCollection.deleteMany({});
    },
};
