import { baseRoutes } from '../../src/configs';
import { postsModel } from '../../src/posts';
import { TBlog } from '../../src/blogs';
import {
    addNewBlog,
    addNewPost,
    DBHandlers,
    invalidAuthData,
    invalidObjectId,
    invalidPostsFields,
    postsValidationErrorMessages,
    req,
    testBlog,
    testPost,
    validAuthData,
    validObjectId,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';

describe('Posts Controller', () => {
    let createdBlog: TBlog;

    beforeEach(async () => {
        await postsModel.deleteAllPosts();
        createdBlog = await addNewBlog(testBlog);
        testPost.blogId = createdBlog.id;
    });

    beforeAll(async () => {
        await DBHandlers.connectToDB();
    });

    afterAll(async () => {
        await DBHandlers.closeDB();
    });

    describe('GET /posts', () => {
        it('returns an empty array initially', async () => {
            const response = await req.get(baseRoutes.posts);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual([]);
        });

        it('returns a list of posts after creating one', async () => {
            await addNewPost(testPost);
            const response = await req.get(baseRoutes.posts);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual([expect.objectContaining(testPost)]);
        });
    });

    describe('POST /posts', () => {
        it('can not create a new post without authorization', async () => {
            const response = await req.post(baseRoutes.posts).send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a post if auth data is invalid', async () => {
            const response = await req
                .post(baseRoutes.posts)
                .auth(...invalidAuthData)
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new post', async () => {
            const response = await req
                .post(baseRoutes.posts)
                .auth(...validAuthData)
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body).toEqual(expect.objectContaining(testPost));
            expect(response.body.blogName).toEqual(createdBlog.name);
        });

        it('returns an error if required fields are missing', async () => {
            (Object.keys(testPost) as (keyof typeof testPost)[]).forEach(
                async (key) => {
                    const newPost = { ...testPost };
                    delete newPost[key];
                    const response = await req
                        .post(baseRoutes.posts)
                        .auth(...validAuthData)
                        .send(newPost)
                        .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                    expect(response.body.errorsMessages[0].field).toEqual(key);
                }
            );
        });

        it('returns an error if title field is not valid', async () => {
            const newPost = {
                ...testPost,
            };

            newPost.title = invalidPostsFields.title.length;

            const response = await req
                .post(baseRoutes.posts)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('title');
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.title.length
            );
        });

        it('returns an error if shortDescription field is not valid', async () => {
            const newPost = {
                ...testPost,
            };

            newPost.shortDescription =
                invalidPostsFields.shortDescription.length;

            const response = await req
                .post(baseRoutes.posts)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual(
                'shortDescription'
            );
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.shortDescription.length
            );
        });

        it('returns an error if content field is not valid', async () => {
            const newPost = {
                ...testPost,
            };

            newPost.content = invalidPostsFields.content.length;

            const response = await req
                .post(baseRoutes.posts)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('content');
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.content.length
            );
        });

        it('returns an error if blogId field is not valid', async () => {
            const newPost = {
                ...testPost,
            };

            newPost.blogId = invalidObjectId;

            const response_1 = await req
                .post(baseRoutes.posts)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_1.body.errorsMessages[0].field).toEqual('blogId');
            expect(response_1.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.blogId.format
            );

            newPost.blogId = validObjectId;

            const response_2 = await req
                .post(baseRoutes.posts)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_2.body.errorsMessages[0].field).toEqual('blogId');
            expect(response_2.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.blogId.value
            );
        });
    });

    describe('GET /posts/:id', () => {
        it('returns a post by id', async () => {
            const createdPost = await addNewPost(testPost);
            const response = await req.get(
                `${baseRoutes.posts}/${createdPost.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual(expect.objectContaining(createdPost));
        });

        it("returns an error if post's id is not valid", async () => {
            const createdPost = await addNewPost(testPost);
            const response = await req.get(
                `${baseRoutes.posts}/${createdPost.id.slice(1, 7)}`
            );
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.id.format
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if post is not found', async () => {
            const response = await req.get(
                `${baseRoutes.posts}/${validObjectId}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });

    describe('PUT /posts/:id', () => {
        it('updates a post', async () => {
            const createdPost = await addNewPost(testPost);
            const updatedPost = { ...createdPost, title: 'Updated Post' };
            const response_1 = await req
                .put(`${baseRoutes.posts}/${createdPost.id}`)
                .auth(...validAuthData)
                .send(updatedPost);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const response_2 = await req.get(
                `${baseRoutes.posts}/${createdPost.id}`
            );
            expect(response_2.body).toEqual(
                expect.objectContaining(updatedPost)
            );
        });

        it('can not update a post without authorization', async () => {
            const updatedPost = {
                ...testPost,
                title: 'Updated title',
            };
            const response = await req
                .put(`${baseRoutes.posts}/${validObjectId}`)
                .send(updatedPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if post is not found', async () => {
            const updatedPost = { ...testPost, title: 'Updated Post' };
            const response = await req
                .put(`${baseRoutes.posts}/${validObjectId}`)
                .auth(...validAuthData)
                .send(updatedPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it("returns an error if post's id is not valid", async () => {
            const updatedPost = {
                ...testPost,
                title: 'Updated title',
            };
            const response = await req
                .put(`${baseRoutes.posts}/${invalidObjectId}`)
                .auth(...validAuthData)
                .send(updatedPost);
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.id.format
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });
    });

    describe('DELETE /posts/:id', () => {
        it('can not delete a post without authorization', async () => {
            const createdPost = await addNewPost(testPost);
            const response = await req.delete(
                `${baseRoutes.posts}/${createdPost.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a post if auth data is invalid', async () => {
            const createdPost = await addNewPost(testPost);
            const response = await req
                .delete(`${baseRoutes.posts}/${createdPost.id}`)
                .auth(...invalidAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('deletes a post', async () => {
            const createdPost = await addNewPost(testPost);
            const response_1 = await req
                .delete(`${baseRoutes.posts}/${createdPost.id}`)
                .auth(...validAuthData);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const response_2 = await req.get(
                `${baseRoutes.posts}/${createdPost.id}`
            );
            expect(response_2.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it("returns an error if post's id is not valid", async () => {
            const response = await req
                .delete(`${baseRoutes.posts}/${invalidObjectId}`)
                .auth(...validAuthData);
            expect(response.body.errorsMessages[0].message).toEqual(
                postsValidationErrorMessages.id.format
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if post is not found', async () => {
            const response = await req
                .delete(`${baseRoutes.posts}/${validObjectId}`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });
});
