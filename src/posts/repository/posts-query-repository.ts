import { ObjectId } from 'mongodb';
import { postsCollection, PostsDBSearchParams } from '../model';
import { PostViewModel } from '../types';
import {
    AllItemsViewModel,
    TMappedSearchQueryParams,
} from '../../shared/types';
import { createResponseError, getDBSearchQueries } from '../../shared/helpers';
import { blogsCollection } from '../../blogs';

export const postsQueryRepository = {
    async getPosts({
        searchQueries,
    }: {
        searchQueries: TMappedSearchQueryParams<PostsDBSearchParams['sortBy']>;
    }): Promise<AllItemsViewModel<PostViewModel>> {
        const dbSearchQueries =
            getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await postsCollection.countDocuments({});
        const foundPosts = await postsCollection
            .find({})
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit)
            .toArray();
        const mappedFoundPosts = foundPosts.map((post) => {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            };
        });
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundPosts,
        };
    },

    async getPost(id: string) {
        const foundPost = await postsCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!foundPost) return undefined;
        return {
            id: foundPost._id.toString(),
            title: foundPost.title,
            shortDescription: foundPost.shortDescription,
            content: foundPost.content,
            blogId: foundPost.blogId,
            blogName: foundPost.blogName,
            createdAt: foundPost.createdAt,
        };
    },

    async getBlogPosts({
        searchQueries,
        blogId,
    }: {
        searchQueries: TMappedSearchQueryParams<PostsDBSearchParams['sortBy']>;
        blogId: string;
    }): Promise<
        | AllItemsViewModel<PostViewModel>
        | ReturnType<typeof createResponseError>
    > {
        const blog = await blogsCollection.findOne({
            _id: new ObjectId(blogId),
        });
        if (!blog) {
            return await Promise.resolve(
                createResponseError('Blog not found', 'id')
            );
        }
        const dbSearchQueries =
            getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await postsCollection.countDocuments({ blogId });
        const foundPosts = await postsCollection
            .find({ blogId })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit)
            .toArray();
        const mappedFoundPosts = foundPosts.map((post) => {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            };
        });
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundPosts,
        };
    },
};
