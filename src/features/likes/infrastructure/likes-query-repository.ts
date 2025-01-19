import { inject, injectable } from 'inversify';
import { NewestLikesViewModel } from '../api/types';
import { UsersQueryRepository } from '../../users/infrastructure/users-query-repository';
import { LikeModel } from '../domain/like-entity';

@injectable()
export class LikesQueryRepository {
    constructor(
        @inject(UsersQueryRepository)
        protected usersQueryRepository: UsersQueryRepository
    ) {}

    async getLikeStatus(parentId: string, userId: string) {
        const foundLike = await LikeModel.findOne({ parentId, userId });
        return foundLike ? foundLike.status : 'None';
    }

    async getLikesArray(parentIdsArray: string[], userId: string) {
        const foundLikes = await LikeModel.find({
            parentId: { $in: parentIdsArray },
            userId,
        }).lean();
        return foundLikes;
    }

    async getLastThreeLikes(parentId: string) {
        const foundLikes = await LikeModel.find({ parentId, status: 'Like' })
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
