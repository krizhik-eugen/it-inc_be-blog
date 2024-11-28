import { TBlogSearchParams } from '../types';
import { blogsRepository } from '../repository';
import { getSearchQueries, getDBSearchQueries } from '../../helpers';
import { TSearchQueryParams } from '../../types';
import { postsRepository } from '../../posts';

export const blogsService = {
    async getBlogs(req: TBlogSearchParams) {
        const { searchNameTerm, ...restQueries } = req.query;
        const searchQueries = getSearchQueries(restQueries);
        const dbSearchQueries = getDBSearchQueries(searchQueries);
        const totalCount = await blogsRepository.getBlogsCount(searchNameTerm);
        const foundBlogs = await blogsRepository.getBlogs(dbSearchQueries);

        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundBlogs,
        };
    },

    async getBlogPosts (req: TSearchQueryParams) {
        const searchQueries = getSearchQueries(req);
        const totalCount = await postsRepository.getPostsCount();
        const dbSearchQueries = getDBSearchQueries(searchQueries)
        const foundPosts = await postsRepository.getPosts(dbSearchQueries);
        return {
            pagesCount: Math.ceil(totalCount / Number(searchQueries.pageSize)),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundPosts,
        };
    }
};
