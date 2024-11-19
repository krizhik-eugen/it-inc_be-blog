import { postsModel, TPost } from '../../src/posts';

describe('postsModel', () => {
    beforeEach(async () => {
        await postsModel.deleteAllPosts();
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

    it('getAllPosts returns an empty array initially', async () => {
        expect(await postsModel.getAllPosts()).toEqual([]);
    });

    it('addNewPost adds a new post to the database', async () => {
        const addedPost = await postsModel.addNewPost(newPost1);
        expect(addedPost).toHaveProperty('id');
        expect(await postsModel.getAllPosts()).toEqual([addedPost]);
    });

    it('getPost returns a post by id', async () => {
        const addedPost = await postsModel.addNewPost(newPost1);
        const retrievedPost = await postsModel.getPost(addedPost.id);
        expect(retrievedPost).toEqual(addedPost);
    });

    it('updatePost updates a post in the database', async () => {
        const addedPost = await postsModel.addNewPost(newPost1);
        const updatedPost = { ...addedPost, title: 'Updated Post 1' };
        await postsModel.updatePost(updatedPost);
        const retrievedPost = await postsModel.getPost(addedPost.id);
        expect(retrievedPost).toEqual(updatedPost);
    });

    it('deletePost deletes a post from the database', async () => {
        const addedPost = await postsModel.addNewPost(newPost1);
        await postsModel.deletePost(addedPost.id);
        expect(await postsModel.getPost(addedPost.id)).toBeUndefined();
    });

    it('deleteAllPosts deletes all posts from the database', async () => {
        await postsModel.addNewPost(newPost1);
        await postsModel.addNewPost(newPost2);
        await postsModel.deleteAllPosts();
        expect(await postsModel.getAllPosts()).toEqual([]);
    });
});
