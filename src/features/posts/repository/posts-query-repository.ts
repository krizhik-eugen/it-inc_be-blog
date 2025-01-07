import { PostsModel, PostsDBSearchParams } from '../model';
import { TMappedSearchQueryParams } from '../../../shared/types';
import { getDBSearchQueries } from '../../../shared/helpers';
import { BlogsModel } from '../../../features/blogs';

export class PostsQueryRepository {
    async getPosts({
        searchQueries,
    }: {
        searchQueries: TMappedSearchQueryParams<PostsDBSearchParams['sortBy']>;
    }) {
        const dbSearchQueries =
            getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await PostsModel.countDocuments({});
        const foundPosts = await PostsModel.find({})
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const mappedFoundPosts = foundPosts.map((post) => {
            return {
                id: post.id,
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
    }

    async getPost(id: string) {
        const foundPost = await PostsModel.findById(id);
        if (!foundPost) return undefined;
        return {
            id: foundPost.id,
            title: foundPost.title,
            shortDescription: foundPost.shortDescription,
            content: foundPost.content,
            blogId: foundPost.blogId,
            blogName: foundPost.blogName,
            createdAt: foundPost.createdAt,
        };
    }

    async getBlogPosts({
        searchQueries,
        blogId,
    }: {
        searchQueries: TMappedSearchQueryParams<PostsDBSearchParams['sortBy']>;
        blogId: string;
    }) {
        const blog = await BlogsModel.findById(blogId);
        if (!blog) {
            return;
        }
        const dbSearchQueries =
            getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await PostsModel.countDocuments({ blogId });
        const foundPosts = await PostsModel.find({ blogId })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const mappedFoundPosts = foundPosts.map((post) => {
            return {
                id: post.id,
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
    }
}
