import { TBlogSearchParams } from '../types';
import { blogsRepository } from '../repository';
import { getSearchQueries } from '../../helpers';
import { TSearchQueryParams } from '../../types';
import { postsRepository } from '../../posts';

export const blogsService = {
    async getBlogs(req: TBlogSearchParams) {
        const { searchNameTerm, ...restQueries } = req.query;
        const searchNameTermValue = searchNameTerm ?? '';
        const searchQueries = getSearchQueries(restQueries);
        const totalCount = await blogsRepository.getBlogsCount(searchNameTermValue);
        const foundBlogs = await blogsRepository.getBlogs({searchNameTerm: searchNameTermValue, ...searchQueries});
        return {
            pagesCount: Math.ceil(totalCount / Number(searchQueries.pageSize)),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundBlogs,
        };
    },
    async getBlogPosts (req: TSearchQueryParams) {
        const searchQueries = getSearchQueries(req);
        const totalCount = await postsRepository.getPostsCount();
        const foundPosts = await postsRepository.getPosts(searchQueries);
        return {
            pagesCount: Math.ceil(totalCount / Number(searchQueries.pageSize)),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundPosts,
        };
    }
};
