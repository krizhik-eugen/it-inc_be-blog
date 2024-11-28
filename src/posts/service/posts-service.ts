import { TPostSearchParams } from '../types';
import { postsRepository } from '../repository';
import { getDBSearchQueries, getSearchQueries } from '../../helpers';

export const postsService = {
    async getPosts(req: TPostSearchParams) {
        const searchQueries = getSearchQueries(req.query);
        const dbSearchQueries = getDBSearchQueries(searchQueries);
        const totalCount = await postsRepository.getPostsCount();
        const foundPosts = await postsRepository.getPosts(dbSearchQueries);
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundPosts,
        };
    },
};
