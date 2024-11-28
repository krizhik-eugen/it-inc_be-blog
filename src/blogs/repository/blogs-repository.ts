import { ObjectId } from 'mongodb';
import { blogsCollection } from '../model';
import { TBlog, TBlogQueryParams } from '../types';
import { TDBSearchParams } from '../../types';

export const blogsRepository = {

    async getBlogsCount(searchNameTerm = ''): Promise<number> {
        return await blogsCollection.countDocuments({name: {$regex: searchNameTerm ?? '', $options: 'i'}});
    },  

    async getBlogs(searchQueries: Required<TDBSearchParams & {searchNameTerm: string}>): Promise<TBlog[]> {    

        const allData = await blogsCollection
        .find({name: { $regex: searchQueries.searchNameTerm ?? '', $options: 'i' }})
        .sort({ [searchQueries.sortBy]: searchQueries.sortDirection })
        .skip((searchQueries.pageNumber - 1) * searchQueries.pageSize)
        .limit(searchQueries.pageSize)
        .toArray();
        
        return allData.map((blog) => {
            const { _id, ...blogWithoutId } = blog;
            return { ...blogWithoutId, id: _id.toString() };
        });
    },
    async addNewBlog(
        newBlog: Omit<TBlog, 'id' | 'createdAt' | 'isMembership'>
    ): Promise<TBlog | undefined> {
        const result = await blogsCollection.insertOne({
            ...newBlog,
            createdAt: new Date().toISOString(),
            isMembership: false,
        });
        return this.getBlog(result.insertedId.toString());
    },
    async getBlog(id: TBlog['id']): Promise<TBlog | undefined> {
        const foundBlog = await blogsCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!foundBlog) return undefined;
        const { _id, ...foundBlogWithoutId } = foundBlog;
        return { ...foundBlogWithoutId, id: _id.toString() };
    },
    async updateBlog(updatedBlog: TBlog) {
        const { id, ...blogToInsert } = updatedBlog;
        const _id = new ObjectId(id);
        const result = await blogsCollection.updateOne(
            { _id },
            { $set: blogToInsert }
        );
        return result.modifiedCount > 0;
    },
    async deleteBlog(id: TBlog['id']) {
        const _id = new ObjectId(id);
        const result = await blogsCollection.deleteOne({ _id });
        return result.deletedCount > 0;
    },
    async setBlogs(blogs: TBlog[]) {
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
