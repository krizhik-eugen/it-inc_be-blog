import { injectable } from 'inversify';
import { LikeModel } from '../domain/like-entity';
import { LikeDocument } from '../domain/types';

@injectable()
export class LikesRepository {
    async findLikeByUserIdAndParentId(userId: string, parentId: string) {
        return await LikeModel.findOne({ userId, parentId });
    }

    async save(like: LikeDocument) {
        return like.save();
    }

    async getLikesCountByParentId(parentId: string) {
        const result = await LikeModel.countDocuments({
            parentId,
            status: 'Like',
        });
        return result;
    }

    async getDislikesCountByParentId(parentId: string) {
        const result = await LikeModel.countDocuments({
            parentId,
            status: 'Dislike',
        });
        return result;
    }

    async deleteLikesByParentId(parentId: string) {
        const result = await LikeModel.deleteMany({ parentId });
        return result.deletedCount || 0;
    }

    async deleteAllLikes() {
        const result = await LikeModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
