import { injectable } from 'inversify';
import { CommentModel } from '../domain/comment-entity';
import { CommentDocument } from '../domain/types';

@injectable()
export class CommentsRepository {
    async save(comment: CommentDocument) {
        return comment.save();
    }

    async findCommentById(id: string) {
        const result = await CommentModel.findById(id);
        return result;
    }

    async deleteCommentById(id: string) {
        const result = await CommentModel.deleteOne({ _id: id });
        return result.deletedCount || 0;
    }

    async deleteAllComments() {
        const result = await CommentModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
