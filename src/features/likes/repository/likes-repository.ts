import { LikeDBModel, LikesModel } from '../model/likes-model';

export class LikesRepository {
    async findLikeByUserIdAndParentId(userId: string, parentId: string) {
        return await LikesModel.findOne({ userId, parentId }).lean();
    }

    async addLike(like: LikeDBModel) {
        const result = await LikesModel.create(like);
        return result._id;
    }

    async updateLikeStatus(updatedUser: Partial<LikeDBModel>) {
        const { userId, parentId, status } = updatedUser;
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
