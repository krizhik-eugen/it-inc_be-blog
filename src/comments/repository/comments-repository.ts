import { commentsCollection, CommentDBModel } from '../model';

export const commentsRepository = {
    async addNewComment(newComment: CommentDBModel) {
        const result = await commentsCollection.insertOne(newComment);
        return result.insertedId.toString();
    },

    async updateComment(updatedComment: Partial<CommentDBModel>) {
        const { _id, ...commentToInsert } = updatedComment;
        const result = await commentsCollection.updateOne(
            { _id },
            { $set: commentToInsert }
        );
        return result.modifiedCount > 0;
    },

    async deleteComment(_id: CommentDBModel['_id']) {
        const result = await commentsCollection.deleteOne({ _id });
        return result.deletedCount > 0;
    },

    // async setPosts(
    //     comments: Omit<PostDBModel, 'createdAt' | 'blogName' | 'id'>[]
    // ) {
    //     if (comments.length > 0) {
    //         const mappedPosts = await comments.reduce<Promise<PostDBModel[]>>(
    //             async (accPromise, comment) => {
    //                 const acc = await accPromise; // Wait for accumulated results
    //                 const blog = await blogsRepository.findBlogById(
    //                     new ObjectId(comment.blogId)
    //                 );
    //                 if (!blog) {
    //                     return acc; // Skip adding if blog is undefined
    //                 }
    //                 acc.push({
    //                     ...comment,
    //                     blogName: blog.name,
    //                     createdAt: new Date().toISOString(),
    //                 });
    //                 return acc;
    //             },
    //             Promise.resolve([])
    //         );
    //         await postsCollection.insertMany(mappedPosts);
    //         return;
    //     }
    //     await postsCollection.deleteMany({});
    // },
};
