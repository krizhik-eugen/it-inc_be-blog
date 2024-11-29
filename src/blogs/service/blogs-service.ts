import { TBlogPostsRequest, TBlogSearchParams } from '../types';
import { blogsRepository } from '../repository';
import { getSearchQueries, getDBSearchQueries } from '../../helpers';
import { postsRepository, TCreateUpdatePostRequest } from '../../posts';

export const blogsService = {
    async getBlogs(req: TBlogSearchParams) {
        const { searchNameTerm, ...restQueries } = req.query;
        const searchQueries = getSearchQueries(restQueries);
        const dbSearchQueries = getDBSearchQueries(searchQueries);
        const totalCount = await blogsRepository.getBlogsCount(searchNameTerm);
        const foundBlogs = await blogsRepository.getBlogs({ ...dbSearchQueries, findName: searchNameTerm });
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundBlogs,
        };
    },

    async getBlogPosts(req: TBlogPostsRequest) {
        const blogId = req.params.id;
        const blog = await blogsRepository.getBlog(req.params.id);
        console.log('blog', blog);
        if (!blog) {
            return undefined;
        }
        const searchQueries = getSearchQueries(req.query);
        const totalCount = await postsRepository.getPostsCount(blogId);
        const dbSearchQueries = getDBSearchQueries(searchQueries);
        const foundPosts = await postsRepository.getPosts({ ...dbSearchQueries, blogId });
        return {
            pagesCount: Math.ceil(totalCount / Number(searchQueries.pageSize)),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundPosts,
        };
    },

    async createNewPostForBlog(req: Omit<TCreateUpdatePostRequest, 'blogId'>) {
        const blog = await blogsRepository.getBlog(req.params.id);
        console.log('blog', blog);
        if (!blog) {
            return undefined;
        }
        const newPost = { ...req.body, blogName: blog.name, blogId: blog.id };
        const createdPost = await postsRepository.addNewPost(newPost);
        return createdPost;
    },
};
