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

    async findCommentById(_id: CommentDBModel['_id']) {
        const result = await commentsCollection.findOne({ _id });
        return result;
    },

    async deleteComment(_id: CommentDBModel['_id']) {
        const result = await commentsCollection.deleteOne({ _id });
        return result.deletedCount > 0;
    },

    async clearComments() {
        await commentsCollection.deleteMany({});
    },
};
