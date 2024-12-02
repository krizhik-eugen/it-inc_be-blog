import { ObjectId } from 'mongodb';
import { blogsRepository } from '../../blogs';
import { postsCollection } from '../model';
import { TPost } from '../types';
import { PostDBModel, TPostInstance } from '../model/posts-model';

export const postsRepository = {
    async getPostsCount(blogId = ''){
        return await postsCollection.countDocuments({
            blogId: { $regex: blogId ?? '', $options: 'i' },
        });
    },

    async getPosts(searchQueries): Promise<TPost[]> {
        const foundPosts = await postsCollection
            .find({
                blogId: { $regex: searchQueries.blogId ?? '', $options: 'i' },
            })
            .sort({ [searchQueries.sortBy]: searchQueries.sortDirection })
            .skip(searchQueries.skip)
            .limit(searchQueries.limit)
            .toArray();
        return foundPosts.map((post) => {
            const { _id, ...postWithoutId } = post;
            return { ...postWithoutId, id: _id.toString() };
        });
    },

    async addNewPost(newPost: PostDBModel) {
        const result = await postsCollection.insertOne(newPost);
        return this.getPost(result.insertedId.toString());
    },

    async getPost(_id: PostDBModel['_id']) {
        return await postsCollection.findOne({_id});
    },

    async updatePost(updatedPost: TPost) {
        const { id, ...postToInsert } = updatedPost;
        const _id = new ObjectId(id);
        const result = await postsCollection.updateOne(
            { _id },
            { $set: postToInsert }
        );
        return result.modifiedCount > 0;
    },

    async deletePost(id: TPost['id']) {
        const _id = new ObjectId(id);
        const result = await postsCollection.deleteOne({ _id });
        return result.deletedCount > 0;
    },

    async setPosts(posts: Omit<TPost, 'createdAt' | 'blogName' | 'id'>[]) {
        if (posts.length > 0) {
            const mappedPosts = await posts.reduce<Promise<TPostInstance[]>>(
                async (accPromise, post) => {
                    const acc = await accPromise; // Wait for accumulated results
                    const blog = await blogsRepository.getBlog(post.blogId);
                    if (!blog) {
                        return acc; // Skip adding if blog is undefined
                    }
                    acc.push({
                        ...post,
                        blogName: blog.name,
                        createdAt: new Date().toISOString(),
                    });
                    return acc;
                },
                Promise.resolve([])
            );
            await postsCollection.insertMany(mappedPosts);
            return;
        }
        await postsCollection.deleteMany({});
    },
};
