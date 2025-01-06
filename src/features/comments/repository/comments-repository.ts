import { CommentsModel, CommentDBModel } from '../model';

export const commentsRepository = {
    async addNewComment(newComment: CommentDBModel) {
        const result = await CommentsModel.create(newComment);
        return result.id;
    },

    async updateComment(
        updatedComment: Partial<CommentDBModel & { id: string }>
    ) {
        const { id, ...commentToInsert } = updatedComment;
        const result = await CommentsModel.findByIdAndUpdate(
            id,
            commentToInsert,
            {
                new: true,
            }
        ).lean();
        return result;
    },

    async findCommentById(id: string) {
        const result = await CommentsModel.findById(id).lean();
        return result;
    },

    async deleteComment(id: string) {
        const result = await CommentsModel.findByIdAndDelete(id).lean();
        return result;
    },

    async clearComments() {
        const result = await CommentsModel.deleteMany({});
        return result.deletedCount || 0;
    },
};
