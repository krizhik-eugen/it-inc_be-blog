import { injectable } from 'inversify';
import { BlogsModel, BlogsDBSearchParams } from '../model';
import { BlogViewModel } from '../types';
import {
    AllItemsViewModel,
    TMappedSearchQueryParams,
} from '../../../shared/types';
import { getDBSearchQueries } from '../../../shared/helpers';

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
        const totalCount = await BlogsModel.countDocuments({
            name: { $regex: term ?? '', $options: 'i' },
        });
        const foundBlogs = await BlogsModel.find({
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
        const foundBlog = await BlogsModel.findById(id);
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
