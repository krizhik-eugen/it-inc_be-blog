
import { blogsRepository } from '../repository';
import { getSearchQueries, getDBSearchQueries } from '../../helpers';
import { postsRepository } from '../../posts';
import { TCreateNewBlogPostRequest, TGetAllBlogPostsRequest } from '../types';
import { ObjectId } from 'mongodb';
import { PostDBModel, PostsDBSearchParams } from '../../posts/model/posts-model';

export const blogsService = {


    async getBlogPosts(req: TGetAllBlogPostsRequest) {
        const blogId = req.params.id;
        const blog = await blogsRepository.findBlogById(new ObjectId(blogId))
        if (!blog) {
            return undefined;
        }
        const searchQueries = getSearchQueries<PostsDBSearchParams['sortBy']>(req.query);
        const dbSearchQueries = getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);

        //TODO: check from where to fetch posts
        const totalCount = await postsRepository.getPostsCount(blogId);

        const foundPosts = await postsRepository.getPosts({ ...dbSearchQueries, blogId });
        return {
            pagesCount: Math.ceil(totalCount / Number(searchQueries.pageSize)),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: foundPosts,
        };
    },

    async createNewPostForBlog(req: TCreateNewBlogPostRequest) {
        const blog = await blogsRepository.findBlogById( new ObjectId(req.params.id));
        if (!blog) {
            return undefined;
        }
        const newPost: PostDBModel = { 
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date().toISOString(),
         };

        const createdPostId = await postsRepository.addNewPost(newPost);
        const addedPost = await postsRepository.getPost(new ObjectId(createdPostId));
        if (!addedPost) {
            return undefined;
        }
        return {
            id: addedPost._id.toString(),
            title: addedPost.title,
            shortDescription: addedPost.shortDescription,
            content: addedPost.content,
            blogId: addedPost.blogId,
            blogName: addedPost.blogName,
            createdAt: addedPost.createdAt,
        };
    },
};
