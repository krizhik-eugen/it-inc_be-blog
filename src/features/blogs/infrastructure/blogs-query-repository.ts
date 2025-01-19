import { injectable } from 'inversify';
import {
    AllItemsViewModel,
    TMappedSearchQueryParams,
} from '../../../shared/types';
import { getDBSearchQueries } from '../../../shared/helpers';
import { BlogViewModel } from '../api/types';
import { BlogModel } from '../domain/blog-entity';
import { BlogsDBSearchParams } from '../domain/types';

@injectable()
export class BlogsQueryRepository {
    async getBlogs({
        searchQueries,
        term,
    }: {
        searchQueries: TMappedSearchQueryParams<BlogsDBSearchParams['sortBy']>;
        term?: string;
    }): Promise<AllItemsViewModel<BlogViewModel>> {
        const dbSearchQueries =
            getDBSearchQueries<BlogsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await BlogModel.countDocuments({
            name: { $regex: term ?? '', $options: 'i' },
        });
        const foundBlogs = await BlogModel.find({
            name: { $regex: term ?? '', $options: 'i' },
        })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const mappedFoundBlogs: BlogViewModel[] = foundBlogs
            ? foundBlogs.map((blog) => ({
                  id: blog.id,
                  name: blog.name,
                  description: blog.description,
                  websiteUrl: blog.websiteUrl,
                  createdAt: blog.createdAt,
                  isMembership: blog.isMembership,
              }))
            : [];
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundBlogs,
        };
    }

    async getBlog(id: string): Promise<BlogViewModel | undefined> {
        const foundBlog = await BlogModel.findById(id);
        if (!foundBlog) return undefined;
        return {
            id: foundBlog.id,
            name: foundBlog.name,
            description: foundBlog.description,
            websiteUrl: foundBlog.websiteUrl,
            createdAt: foundBlog.createdAt,
            isMembership: foundBlog.isMembership,
        };
    }
}
