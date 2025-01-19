import { injectable } from 'inversify';
import { LikeDBModel, LikesModel } from './likes-model';

@injectable()
export class LikesRepository {
    async findLikeByUserIdAndParentId(userId: string, parentId: string) {
        return await LikesModel.findOne({ userId, parentId }).lean();
    }

    async addLike(like: LikeDBModel) {
        const result = await LikesModel.create(like);
        return result._id;
    }

    async updateLikeStatus(updatedLike: Partial<LikeDBModel>) {
        const { userId, parentId, status } = updatedLike;
        const result = await LikesModel.findOneAndUpdate(
            { userId, parentId },
            { status },
            {
                new: true,
            }
        ).lean();
        return result;
    }

    async getLikesCountByParentId(parentId: string) {
        const result = await LikesModel.countDocuments({
            parentId,
            status: 'Like',
        });
        return result;
    }

    async getDislikesCountByParentId(parentId: string) {
        const result = await LikesModel.countDocuments({
            parentId,
            status: 'Dislike',
        });
        return result;
    }

    async deleteLikesByParentId(parentId: string) {
        const result = await LikesModel.deleteMany({ parentId });
        return result.deletedCount || 0;
    }

    async clearLikes() {
        const result = await LikesModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
