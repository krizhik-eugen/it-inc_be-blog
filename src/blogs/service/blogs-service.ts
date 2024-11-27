import { TBlogQueryParams } from '../types';
import { DEFAULT_SEARCH_PARAMS } from '../../constants';
import { blogsRepository } from '../repository';
import { TSearchQueryParams } from '../../types';

export const blogsService = {
    async getBlogs(queries: TBlogQueryParams) {
        const { term, sortBy, sortDirection, pageNumber, pageSize } = queries;
        const getSortDirectionValue = ( sortDirection: TBlogQueryParams['sortDirection'] ) => {
            if ( sortDirection === 'asc' || sortDirection === 1 ) {
                return 1;
            } 
            return -1;
        };

        const totalCount = await blogsRepository.getBlogsCount(term ?? '');

        const searchQueries: TSearchQueryParams = {
            sortBy: sortBy || DEFAULT_SEARCH_PARAMS.sortBy,
            sortDirection: getSortDirectionValue(sortDirection),
            pageNumber: pageNumber ?? DEFAULT_SEARCH_PARAMS.pageNumber,
            pageSize: pageSize || DEFAULT_SEARCH_PARAMS.pageSize,
        };

        const foundBlogs = await blogsRepository.getBlogs({term, ...searchQueries});

        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundBlogs,
        };


    }
    
};
