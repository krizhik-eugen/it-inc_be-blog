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

    async setBlogs(
        blogs: Omit<BlogDBModel, 'id' | 'createdAt' | 'isMembership'>[]
    ) {
        if (blogs.length > 0) {
            const mappedBlogs = blogs.map((blog) => {
                return {
                    ...blog,
                    createdAt: new Date().toISOString(),
                    isMembership: false,
                };
            });
            await blogsCollection.insertMany(mappedBlogs);
            return;
        }
        await blogsCollection.deleteMany({});
    },
};
