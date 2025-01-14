import { inject, injectable } from 'inversify';
import { UsersQueryRepository } from '../../users/repository';
import { LikesModel } from '../model/likes-model';
import { NewestLikesViewModel } from '../types';

@injectable()
export class LikesQueryRepository {
    constructor(
        @inject(UsersQueryRepository)
        protected usersQueryRepository: UsersQueryRepository
    ) {}

    async getLikeStatus(parentId: string, userId: string) {
        const foundLike = await LikesModel.findOne({ parentId, userId });
        return foundLike ? foundLike.status : 'None';
    }

    async getLikesArray(parentIdsArray: string[]) {
        const foundLikes = await LikesModel.find({
            $in: parentIdsArray,
        }).lean();
        return foundLikes;
    }

    async getLastThreeLikes(parentId: string) {
        const foundLikes = await LikesModel.find({ parentId, status: 'Like' })
            .sort({
                createdAt: -1,
            })
            .limit(3);
        const mappedFoundLikes: NewestLikesViewModel = [];
        for (const like of foundLikes) {
            const user = await this.usersQueryRepository.getUser(like.userId);
            mappedFoundLikes.push({
                addedAt: like.createdAt,
                userId: like.userId,
                login: user?.login || '',
            });
        }
        return mappedFoundLikes;
    }
}
