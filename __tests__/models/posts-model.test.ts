import { postsModel } from '../../src/models/posts-model';
import { TPost } from '../../src/models/types';

describe('postsModel', () => {
    beforeEach(() => {
        postsModel.deleteAllPosts();
    });

    const newPost1: TPost = {
        id: '1',
        title: 'New Post 1',
        content: 'This is a new post',
        blogId: 'blog1',
        blogName: 'Blog name 1',
        shortDescription: 'Short post 1 description',
    };
    const newPost2: TPost = {
        id: '2',
        title: 'New Post 2',
        content: 'This is another new post',
        blogId: 'blog2',
        blogName: 'Blog name 2',
        shortDescription: 'Short post 2 description',
    };

    it('getAllPosts returns an empty array initially', () => {
        expect(postsModel.getAllPosts()).toEqual([]);
    });

    it('addNewPost adds a new post to the database', () => {
        const addedPost = postsModel.addNewPost(newPost1);
        expect(addedPost).toHaveProperty('id');
        expect(postsModel.getAllPosts()).toEqual([addedPost]);
    });

    it('getPost returns a post by id', () => {
        const addedPost = postsModel.addNewPost(newPost1);
        const retrievedPost = postsModel.getPost(addedPost.id);
        expect(retrievedPost).toEqual(addedPost);
    });

    it('updatePost updates a post in the database', () => {
        const addedPost = postsModel.addNewPost(newPost1);
        const updatedPost = { ...addedPost, title: 'Updated Post 1' };
        postsModel.updatePost(updatedPost);
        const retrievedPost = postsModel.getPost(addedPost.id);
        expect(retrievedPost).toEqual(updatedPost);
    });

    it('deletePost deletes a post from the database', () => {
        const addedPost = postsModel.addNewPost(newPost1);
        postsModel.deletePost(addedPost.id);
        expect(postsModel.getPost(addedPost.id)).toBeUndefined();
    });

    it('deleteAllPosts deletes all posts from the database', () => {
        postsModel.addNewPost(newPost1);
        postsModel.addNewPost(newPost2);
        postsModel.deleteAllPosts();
        expect(postsModel.getAllPosts()).toEqual([]);
    });
});
