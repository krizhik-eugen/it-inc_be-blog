import { LikesModel } from '../model/likes-model';

export class LikesQueryRepository {
    async getLikeStatus(parentId: string, userId: string) {
        const foundLike = await LikesModel.findOne({ parentId, userId });
        return foundLike ? foundLike.status : 'None';
    }
}
