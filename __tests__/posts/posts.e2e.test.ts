import { baseRoutes } from '../../src/configs';
import { postsRepository } from '../../src/posts';
import { BlogViewModel } from '../../src/blogs';
import {
    addNewBlog,
    addNewPost,
    DBHandlers,
    idValidationErrorMessages,
    invalidAuthData,
    invalidObjectId,
    invalidPostsFields,
    postsValidationErrorMessages,
    req,
    testBlogs,
    testPosts,
    validAuthData,
    validObjectId,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';

describe('Posts Controller', () => {
    let createdBlog: BlogViewModel;
    const testPost = testPosts[0];

    beforeAll(async () => {
        await DBHandlers.connectToDB();
    });

    afterAll(async () => {
        await DBHandlers.closeDB();
    });

    beforeEach(async () => {
        await postsRepository.setPosts([]);
        createdBlog = await addNewBlog(testBlogs[0]);
        testPost.blogId = createdBlog.id;
    });

    const setTestPosts = async (blogId: string) => {
        for (let i = 0; i < testPosts.length; i++) {
            await addNewPost({ ...testPosts[i], blogId });
        }
    };

    describe('GET /posts', () => {
        beforeEach(async () => {
            await setTestPosts(createdBlog.id);
        });

        it('returns an empty array initially', async () => {
            await postsRepository.setPosts([]);
            const response = await req.get(baseRoutes.posts);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(0);
            expect(response.body.items).toEqual([]);
        });

        it('returns a list of posts after creating one', async () => {
            const response = await req.get(`${baseRoutes.posts}`);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(9);
            expect(response.body.page).toEqual(1);
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0].title).toEqual(testPosts[8].title);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeGreaterThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
        });

        it('returns errors if invalid search params are provided', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?sortDirection=ascqwerty&sortBy=createdAtqwerty&pageSize=0&pageNumber=big_number`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages.length).toEqual(4);
            const errorsParams = response.body.errorsMessages.map(
                (error: { message: string; field: string }) => error.field
            );
            ['sortDirection', 'sortBy', 'pageSize', 'pageNumber'].forEach(
                (param) => {
                    expect(errorsParams).toContain(param);
                }
            );
        });

        it('returns a list of posts sorted by createdAt and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(testPosts[0].title);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.totalCount).toEqual(9);
        });

        it('returns a list of posts sorted by title and descending order', async () => {
            const response = await req.get(`${baseRoutes.posts}?sortBy=title`);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(testPosts[8].title);
            expect(
                response.body.items[0].title > response.body.items[8].title
            ).toBeTruthy();
        });

        it('returns a list of posts sorted by title and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?sortBy=title&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(testPosts[0].title);
            expect(
                response.body.items[8].title > response.body.items[0].title
            ).toBeTruthy();
        });

        it('returns a list of posts with pagination and page size 3', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?pageSize=3&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(1);
            expect(response.body.items[2].title).toEqual(testPosts[2].title);
        });

        it('returns a list of posts with pagination, page size 3, and page number 2', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?pageSize=3&sortDirection=asc&pageNumber=2`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].title).toEqual(testPosts[5].title);
        });

        it('returns a list of posts with pagination, page size 4, and page number 3', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?pageSize=4&sortDirection=asc&pageNumber=3`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(1);
            expect(response.body.pageSize).toEqual(4);
            expect(response.body.page).toEqual(3);
            expect(response.body.items[0].title).toEqual(testPosts[8].title);
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
            for (const key of Object.keys(
                testPost
            ) as (keyof typeof testPost)[]) {
                const newPost = { ...testPost };
                delete newPost[key];
                const response = await req
                    .post(baseRoutes.posts)
                    .auth(...validAuthData)
                    .send(newPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST);

                expect(response.body.errorsMessages[0].field).toEqual(key);
            }
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
                idValidationErrorMessages
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
                idValidationErrorMessages
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

        it('can not update a post if auth data is invalid', async () => {
            const response = await req
                .put(`${baseRoutes.posts}/${validObjectId}`)
                .auth(...invalidAuthData)
                .send(testPost);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

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
                idValidationErrorMessages
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if title field is not valid', async () => {
            const newPost = {
                ...testPost,
            };
            newPost.title = invalidPostsFields.title.length;
            const response = await req
                .put(`${baseRoutes.posts}/${validObjectId}`)
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
                .put(`${baseRoutes.posts}/${validObjectId}`)
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
                .put(`${baseRoutes.posts}/${validObjectId}`)
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
                .put(`${baseRoutes.posts}/${validObjectId}`)
                .auth(...validAuthData)
                .send(newPost)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response_1.body.errorsMessages[0].field).toEqual('blogId');
            expect(response_1.body.errorsMessages[0].message).toEqual(
                idValidationErrorMessages
            );
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
                idValidationErrorMessages
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
