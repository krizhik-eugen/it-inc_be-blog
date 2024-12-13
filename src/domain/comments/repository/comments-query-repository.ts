import { ObjectId } from 'mongodb';
import { commentsCollection, CommentsDBSearchParams } from '../model';
import { postsCollection } from '../../../domain/posts';
import { TMappedSearchQueryParams } from '../../../shared/types';
import { getDBSearchQueries } from '../../../shared/helpers';

export const commentsQueryRepository = {
    async getComment(id: string) {
        const foundComment = await commentsCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!foundComment) return undefined;
        return {
            id: foundComment._id.toString(),
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
        const post = await postsCollection.findOne({
            _id: new ObjectId(postId),
        });
        if (!post) {
            return;
        }
        const dbSearchQueries =
            getDBSearchQueries<CommentsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await commentsCollection.countDocuments({ postId });
        const foundPosts = await commentsCollection
            .find({ postId })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit)
            .toArray();
        const mappedFoundComments = foundPosts.map((comment) => {
            return {
                id: comment._id.toString(),
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
