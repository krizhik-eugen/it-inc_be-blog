import { injectable } from 'inversify';
import { BlogModel } from '../domain/blog-entity';
import { BlogDocument } from '../domain/types';

@injectable()
export class BlogsRepository {
    async getBlogsCount(findName = '') {
        return await BlogModel.countDocuments({
            name: { $regex: findName, $options: 'i' },
        });
    }

    async save(blog: BlogDocument) {
        return await blog.save();
    }

    async findBlogById(id: string) {
        return await BlogModel.findById(id);
    }

    async deleteBlogById(id: string) {
        const result = await BlogModel.deleteOne({ _id: id });
        return result.deletedCount || 0;
    }

    async deleteAllBlogs() {
        const result = await BlogModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
