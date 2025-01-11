import { LikesModel } from '../model/likes-model';

export class LikesQueryRepository {
    async getLikeStatusByUserIdAndParentId(userId: string, parentId: string) {
        const foundLike = await LikesModel.findOne({ userId, parentId }).lean();
        return { myStatus: foundLike ? foundLike.status : 'None' };
    }
}
