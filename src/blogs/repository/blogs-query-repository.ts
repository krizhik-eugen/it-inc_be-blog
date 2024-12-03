import { ObjectId } from 'mongodb';
import { blogsCollection, BlogDBModel, BlogsDBSearchParams } from '../model';
import { BlogViewModel, TGetAllBlogsRequest } from '../types';
import { AllItemsViewModel } from '../../common-types';
import { getDBSearchQueries, getSearchQueries } from '../../helpers';

export const blogsQueryRepository = {
    async getBlogs(req: TGetAllBlogsRequest): Promise<AllItemsViewModel<BlogViewModel>> {
        const { searchNameTerm, ...restQueries } = req.query;
        const searchQueries = getSearchQueries<BlogsDBSearchParams['sortBy']>(restQueries);
        const dbSearchQueries = getDBSearchQueries<BlogsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await blogsCollection.countDocuments({
            name: { $regex: searchNameTerm ?? '', $options: 'i' },
        });
        const foundBlogs = await blogsCollection
            .find({
                name: { $regex: searchNameTerm ?? '', $options: 'i' },
            })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit)
            .toArray();        
        const mappedFoundBlogs: BlogViewModel[] = foundBlogs ? foundBlogs.map((blog: Required<BlogDBModel>) => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        })) : [];
        return {
            pagesCount: 1,
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundBlogs,
        };
    },

    async getBlog(id: BlogViewModel['id']): Promise<BlogViewModel | undefined> {
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
