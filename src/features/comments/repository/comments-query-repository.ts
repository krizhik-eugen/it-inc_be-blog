import { CommentsModel, CommentsDBSearchParams } from '../model';
import { PostsModel } from '../../../features/posts/model';
import { TMappedSearchQueryParams } from '../../../shared/types';
import { getDBSearchQueries } from '../../../shared/helpers';
import { LikesQueryRepository } from '../../likes/repository';
import { CommentViewModel } from '../types';
import { TLikeStatus } from '../../likes/types';

export class CommentsQueryRepository {
    constructor(protected likesQueryRepository: LikesQueryRepository) {}

    async getComment(id: string, userId: string | null) {
        const foundComment = await CommentsModel.findById(id);
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
    }: {
        searchQueries: TMappedSearchQueryParams<
            CommentsDBSearchParams['sortBy']
        >;
        postId: string;
    }) {
        const post = await PostsModel.findById(postId);
        if (!post) {
            return;
        }
        const dbSearchQueries =
            getDBSearchQueries<CommentsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await CommentsModel.countDocuments({ postId });
        const foundComments = await CommentsModel.find({ postId })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const mappedFoundComments: CommentViewModel[] = foundComments.map(
            (comment) => {
                return {
                    id: comment.id,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin,
                    },
                    content: comment.content,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: 'None',
                    },
                };
            }
        );
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundComments,
        };
    }
}
