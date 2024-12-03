
import { ObjectId } from 'mongodb';
import { blogsRepository } from '../repository';
import { postsRepository, PostDBModel } from '../../posts';
import { BlogViewModel, TCreateNewBlogPostRequest, TCreateNewBlogRequest, TDeleteBlogRequest, TUpdateBlogRequest } from '../types';
import { BlogDBModel } from '../model';

export const blogsService = {
     async createNewBlog(req: TCreateNewBlogRequest) {
        const {name, description, websiteUrl} = req.body;
        const newBlog: BlogDBModel = {
            name,
            description,
            websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const newBlogId = await blogsRepository.addNewBlog(newBlog);
        const createdBlog = await blogsRepository.findBlogById(new ObjectId(newBlogId));
        if (!createdBlog) {
            return undefined
        }
        const addedBlog: BlogViewModel = {
            id: createdBlog._id.toString(),
            name: createdBlog.name, 
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt,
            isMembership: createdBlog.isMembership
        }
        return addedBlog;
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
        const addedPost = await postsRepository.findPostById(new ObjectId(createdPostId));
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

      async updateBlog(req: TUpdateBlogRequest) {
        const {name, description, websiteUrl} = req.body
        const isBlogUpdated = await blogsRepository.updateBlog({
            name,
            description,
            websiteUrl,
            _id: new ObjectId(req.params.id),
        });
        return isBlogUpdated;
    },

    async deleteBlog(req: TDeleteBlogRequest) {
        const isBlogDeleted = await blogsRepository.deleteBlog(new ObjectId(req.params.id));
        return isBlogDeleted;
    },
};
