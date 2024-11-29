import { TCreateUpdatePostRequest, TPostSearchParams } from '../types';
import { postsRepository } from '../repository';
import { getDBSearchQueries, getSearchQueries } from '../../helpers';
import { blogsRepository } from '../../blogs';

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

    async createNewPost(req: TCreateUpdatePostRequest) {
        const blog = await blogsRepository.getBlog(req.body.blogId);
        if (!blog) {
            return undefined;
        }
        const newPost = { ...req.body, blogName: blog.name };
        const createdPost = await postsRepository.addNewPost(newPost);
        return createdPost;
    },
};
