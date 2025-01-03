import { CommentsModel, CommentsDBSearchParams } from '../model';
import { PostsModel } from '../../../features/posts';
import { TMappedSearchQueryParams } from '../../../shared/types';
import { getDBSearchQueries } from '../../../shared/helpers';

export const commentsQueryRepository = {
    async getComment(id: string) {
        const foundComment = await CommentsModel.findById(id);
        if (!foundComment) return undefined;
        return {
            id: foundComment.id,
            content: foundComment.content,
            commentatorInfo: {
                userId: foundComment.commentatorInfo.userId,
                userLogin: foundComment.commentatorInfo.userLogin,
            },
            createdAt: foundComment.createdAt,
        };
    },

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
        const foundPosts = await CommentsModel.find({ postId })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const mappedFoundComments = foundPosts.map((comment) => {
            return {
                id: comment.id,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin,
                },
                content: comment.content,
                createdAt: comment.createdAt,
            };
        });
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundComments,
        };
    },
};
