import { inject, injectable } from 'inversify';
import { CommentModel } from '../domain/comment-entity';
import { LikesQueryRepository } from '../../likes/infrastructure/likes-query-repository';
import { TMappedSearchQueryParams } from '../../../shared/types';
import { PostModel } from '../../posts/domain/post-entity';
import { getDBSearchQueries } from '../../../shared/helpers';
import { CommentViewModel } from '../api/types';
import { TLikeStatus } from '../../likes/domain/types';
import { CommentsDBSearchParams } from '../domain/types';

@injectable()
export class CommentsQueryRepository {
    constructor(
        @inject(LikesQueryRepository)
        protected likesQueryRepository: LikesQueryRepository
    ) {}

    async getComment(id: string, userId: string | null) {
        const foundComment = await CommentModel.findById(id);
        if (!foundComment) return undefined;
        let likeStatus: TLikeStatus = 'None';
        if (userId) {
            likeStatus = await this.likesQueryRepository.getLikeStatus(
                id,
                userId
            );
        }
        return {
            id: foundComment.id,
            content: foundComment.content,
            commentatorInfo: {
                userId: foundComment.commentatorInfo.userId,
                userLogin: foundComment.commentatorInfo.userLogin,
            },
            createdAt: foundComment.createdAt,
            likesInfo: {
                likesCount: foundComment.likesCount,
                dislikesCount: foundComment.dislikesCount,
                myStatus: likeStatus,
            },
        };
    }

    async getPostComments({
        searchQueries,
        postId,
        userId,
    }: {
        searchQueries: TMappedSearchQueryParams<
            CommentsDBSearchParams['sortBy']
        >;
        postId: string;
        userId: string | null;
    }) {
        const post = await PostModel.findById(postId);
        if (!post) {
            return;
        }
        const dbSearchQueries =
            getDBSearchQueries<CommentsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await CommentModel.countDocuments({ postId });
        const foundComments = await CommentModel.find({ postId })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const commentsIds: string[] = [];
        const mappedFoundComments: CommentViewModel[] = foundComments.map(
            (comment) => {
                commentsIds.push(comment.id);
                return {
                    id: comment.id,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin,
                    },
                    content: comment.content,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: comment.likesCount,
                        dislikesCount: comment.dislikesCount,
                        myStatus: 'None',
                    },
                };
            }
        );
        if (userId) {
            const likesForComments =
                await this.likesQueryRepository.getLikesArray(
                    commentsIds,
                    userId
                );
            mappedFoundComments.forEach((comment) => {
                const like = likesForComments.find(
                    (like) => like.parentId === comment.id
                );
                comment.likesInfo.myStatus = like?.status ?? 'None';
            });
        }
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundComments,
        };
    }
}
