import { ObjectId } from 'mongodb';
import { blogsCollection, BlogDBModel, BlogsDBSearchParams } from '../model';
import { BlogViewModel } from '../types';
import {
    AllItemsViewModel,
    TMappedSearchQueryParams,
} from '../../shared/types';
import { getDBSearchQueries } from '../../shared/helpers';

export const blogsQueryRepository = {
    async getBlogs({
        searchQueries,
        term,
    }: {
        searchQueries: TMappedSearchQueryParams<BlogsDBSearchParams['sortBy']>;
        term?: string;
    }): Promise<AllItemsViewModel<BlogViewModel>> {
        const dbSearchQueries =
            getDBSearchQueries<BlogsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await blogsCollection.countDocuments({
            name: { $regex: term ?? '', $options: 'i' },
        });
        const foundBlogs = await blogsCollection
            .find({
                name: { $regex: term ?? '', $options: 'i' },
            })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit)
            .toArray();
        const mappedFoundBlogs: BlogViewModel[] = foundBlogs
            ? foundBlogs.map((blog: Required<BlogDBModel>) => ({
                  id: blog._id.toString(),
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
    },

    async getBlog(id: string): Promise<BlogViewModel | undefined> {
        const foundBlog = await blogsCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!foundBlog) return undefined;
        return {
            id: foundBlog._id.toString(),
            name: foundBlog.name,
            description: foundBlog.description,
            websiteUrl: foundBlog.websiteUrl,
            createdAt: foundBlog.createdAt,
            isMembership: foundBlog.isMembership,
        };
    },
};
