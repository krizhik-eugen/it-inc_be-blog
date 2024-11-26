import { ObjectId } from 'mongodb';
import { blogsRepository } from '../../blogs';
import { postsCollection } from '../model';
import { TPost } from '../types';
import { TPostInstance } from '../model/posts-model';

export const postsRepository = {
    async getAllPosts(): Promise<TPost[]> {
        const allData = await postsCollection.find().toArray();
        return allData.map((post) => {
            const { _id, ...postWithoutId } = post;
            return { ...postWithoutId, id: _id.toString() };
        });
    },
    async addNewPost(newPost: Omit<TPost, 'id' | 'createdAt' | 'blogName'>) {
        const blog = await blogsRepository.getBlog(newPost.blogId);
        if (!blog) {
            return undefined;
        }
        const result = await postsCollection.insertOne({
            ...newPost,
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        });
        return this.getPost(result.insertedId.toString());
    },
    async getPost(id: TPost['id']) {
        const foundPost = await postsCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!foundPost) return undefined;
        const { _id, ...foundPostWithoutId } = foundPost;
        return { ...foundPostWithoutId, id: _id.toString() };
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
    async setPosts(posts: TPost[]) {
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
