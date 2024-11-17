import request from 'supertest';
import { app } from '../../src/app'; // assuming your app is exported in app.ts
import { blogsModel, postsModel, TBlog, TPost } from '../../src/models';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { baseRoutes } from '../../src/configs';

describe('Posts Controller', () => {
    beforeEach(async () => {
        await postsModel.deleteAllPosts();
    });

    const testPost: Omit<TPost, 'id' | 'blogName'> = {
        title: 'Test Post',
        content: 'Test content',
        blogId: '',
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
        it('can not create a new post without authorization', async () => {
            const response = await request(app)
                .post(baseRoutes.posts)
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new post', async () => {
            const response = await request(app)
                .post(baseRoutes.posts)
                .auth('admin', 'qwerty', { type: 'basic' })
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toEqual(expect.objectContaining(testPost));
            expect(response.body.blogName).toEqual(testBlog.name);
        });

        it('returns an error if required fields are missing', async () => {
            (Object.keys(testPost) as (keyof typeof testPost)[]).forEach(
                async (key) => {
                    const newPost = { ...testPost };
                    delete newPost[key];
                    const response = await request(app)
                        .post(baseRoutes.posts)
                        .auth('admin', 'qwerty', { type: 'basic' })
                        .send(newPost)
                        .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                    expect(response.body.errorsMessages[0].field).toEqual(key);
                }
            );
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
        it('can not update a post without authorization', async () => {
            const postId = '12345';
            const updatedPost = {
                ...testPost,
                title: 'Updated title',
            };
            const response = await request(app)
                .put(`/blogs/${postId}`)
                .send(updatedPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('updates a post', async () => {
            const createdPost = await postsModel.addNewPost(testPost);
            const updatedPost = { ...testPost, title: 'Updated Post' };
            const response = await request(app)
                .put(`${baseRoutes.posts}/${createdPost.id}`)
                .auth('admin', 'qwerty', { type: 'basic' })
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
                .auth('admin', 'qwerty', { type: 'basic' })
                .send(updatedPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });

    describe('DELETE /posts/:id', () => {
        it('can not delete a post without authorization', async () => {
            const createdPost = await postsModel.addNewPost(testPost);
            const response = await request(app).delete(
                `${baseRoutes.posts}/${createdPost.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a post if auth data is invalid', async () => {
            const createdPost = await postsModel.addNewPost(testPost);
            const response = await request(app)
                .delete(`${baseRoutes.posts}/${createdPost.id}`)
                .auth('admin', 'zxcvbn', { type: 'basic' });
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('deletes a post', async () => {
            const createdPost = await postsModel.addNewPost(testPost);
            const response = await request(app)
                .delete(`${baseRoutes.posts}/${createdPost.id}`)
                .auth('admin', 'qwerty', { type: 'basic' });
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const postInDB = await postsModel.getPost(createdPost.id);
            expect(postInDB).toBeUndefined();
        });

        it('returns an error if post is not found', async () => {
            const response = await request(app)
                .delete(`${baseRoutes.posts}/123`)
                .auth('admin', 'qwerty', { type: 'basic' });
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });
});
