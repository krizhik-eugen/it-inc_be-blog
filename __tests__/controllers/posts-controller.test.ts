import request from 'supertest';
import { app } from '../../src/app'; // assuming your app is exported in app.ts
import { blogsModel, postsModel, TBlog, TPost } from '../../src/models';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { baseRoutes } from '../../src/configs';

describe('Posts Controller', () => {
    beforeEach(async () => {
        await postsModel.deleteAllPosts();
    });

    const testPost: Omit<TPost, 'id'> = {
        title: 'Test Post',
        content: 'Test content',
        blogId: '',
        blogName: '',
        shortDescription: 'test shortDescription',
    };

    let testBlog: TBlog;

    beforeAll(async () => {
        const newBlog: Omit<TBlog, 'id'> = {
            name: 'Test Blog',
            description: 'Test description',
            websiteUrl: 'https://test.com',
        };

        const createdBlog = await blogsModel.addNewBlog(newBlog);
        testBlog = createdBlog;
        testPost.blogName = testBlog.name;
        testPost.blogId = testBlog.id;
    });

    describe('GET /posts', () => {
        it('returns an empty array initially', async () => {
            const response = await request(app).get(baseRoutes.posts);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual([]);
        });

        it('returns a list of posts after creating one', async () => {
            await postsModel.addNewPost(testPost);
            const response = await request(app).get(baseRoutes.posts);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual([expect.objectContaining(testPost)]);
        });
    });

    describe('POST /posts', () => {
        it('creates a new post', async () => {
            const response = await request(app)
                .post(baseRoutes.posts)
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toEqual(expect.objectContaining(testPost));
        });

        it('returns an error if required fields are missing', async () => {
            const newPost = { content: 'Test content' };
            const response = await request(app)
                .post(baseRoutes.posts)
                .send(newPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });
    });

    describe('GET /posts/:id', () => {
        it('returns a post by id', async () => {
            const createdPost = await postsModel.addNewPost(testPost);
            const response = await request(app).get(
                `${baseRoutes.posts}/${createdPost.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual(expect.objectContaining(createdPost));
        });

        it('returns an error if post is not found', async () => {
            const response = await request(app).get(`${baseRoutes.posts}/123`);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });

    describe('PUT /posts/:id', () => {
        it('updates a post', async () => {
            const createdPost = await postsModel.addNewPost(testPost);
            const updatedPost = { ...testPost, title: 'Updated Post' };
            const response = await request(app)
                .put(`${baseRoutes.posts}/${createdPost.id}`)
                .send(updatedPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const updatedPostInDB = await postsModel.getPost(createdPost.id);
            expect(updatedPostInDB).toEqual(
                expect.objectContaining(updatedPost)
            );
        });

        it('returns an error if post is not found', async () => {
            const updatedPost = { ...testPost, title: 'Updated Post' };
            const response = await request(app)
                .put(`${baseRoutes.posts}/123`)
                .send(updatedPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });

    describe('DELETE /posts/:id', () => {
        it('deletes a post', async () => {
            const createdPost = await postsModel.addNewPost(testPost);
            const response = await request(app).delete(
                `${baseRoutes.posts}/${createdPost.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const postInDB = await postsModel.getPost(createdPost.id);
            expect(postInDB).toBeUndefined();
        });

        it('returns an error if post is not found', async () => {
            const response = await request(app).delete(
                `${baseRoutes.posts}/123`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });
});
