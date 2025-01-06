import { BlogsModel, BlogDBModel } from '../model';

export const blogsRepository = {
    async getBlogsCount(findName = '') {
        return await BlogsModel.countDocuments({
            name: { $regex: findName, $options: 'i' },
        });
    },

    async addNewBlog(newBlog: BlogDBModel) {
        const result = await BlogsModel.create(newBlog);
        return result.id;
    },

    async findBlogById(id: string) {
        return await BlogsModel.findById(id).lean();
    },

    async updateBlog(updatedBlog: Partial<BlogDBModel & { id: string }>) {
        const { id, ...blogToUpdate } = updatedBlog;
        const result = await BlogsModel.findByIdAndUpdate(id, blogToUpdate, {
            new: true,
        }).lean();
        return result;
    },

    async deleteBlog(id: string) {
        const result = await BlogsModel.findByIdAndDelete(id).lean();
        return result;
    },

    async clearBlogs() {
        const result = await BlogsModel.deleteMany({});
        return result.deletedCount || 0;
    },
};
