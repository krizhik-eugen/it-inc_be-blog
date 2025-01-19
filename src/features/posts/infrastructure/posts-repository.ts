import { injectable } from 'inversify';
import { PostModel } from '../domain/post-entity';
import { PostDocument } from '../domain/types';

@injectable()
export class PostsRepository {
    async getPostsCount(blogId = '') {
        return await PostModel.countDocuments({
            blogId: { $regex: blogId ?? '', $options: 'i' },
        });
    }

    async findPostById(id: string) {
        return await PostModel.findById(id);
    }

    async save(post: PostDocument) {
        return await post.save();
    }

    async deletePostById(id: string) {
        const result = await PostModel.deleteOne({ _id: id });
        return result.deletedCount || 0;
    }

    async deleteAllPosts() {
        const result = await PostModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
