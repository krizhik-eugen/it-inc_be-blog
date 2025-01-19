import {
    PostCreateRequestModel,
    PostViewModel,
} from '../../src/features/posts/api/types';
import {
    addNewBlog,
    addNewPost,
    addNewUser,
    clearAllCollections,
    DBHandlers,
    getTestBlog,
    getTestComment,
    getTestPost,
    getTestUser,
    getUserAuthData,
    idValidationErrorMessages,
    invalidAuthData,
    invalidObjectId,
    postsValidationErrorMessages,
    req,
    textWithLengthGraterThan100,
    textWithLengthGraterThan1000,
    textWithLengthGraterThan30,
    textWithLengthGraterThan300,
    validAuthData,
    validObjectId,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { baseRoutes, routersPaths } from '../../src/app/configs/routes-config';
import { BlogViewModel } from '../../src/features/blogs/api/types';

describe('Posts Controller', () => {
    let createdTestBlog: BlogViewModel;
    let createdTestPost: PostViewModel;
    let createdTestPost_2: PostViewModel;
    let testPost: PostCreateRequestModel;
    let accessToken_1 = '';
    let accessToken_2 = '';
    let accessToken_3 = '';
    const inValidToken = 'qw123' + accessToken_1;
    let testUser_1: ReturnType<typeof getTestUser>;
    let testUser_2: ReturnType<typeof getTestUser>;
    let testUser_3: ReturnType<typeof getTestUser>;

    beforeAll(async () => {
        await DBHandlers.connectToDB();
        createdTestBlog = await addNewBlog(getTestBlog(1));
        testPost = getTestPost(100, createdTestBlog.id);
        await setTestPosts(createdTestBlog.id);
        testUser_1 = getTestUser(1);
        testUser_2 = getTestUser(2);
        testUser_3 = getTestUser(3);
        await addNewUser(testUser_1);
        await addNewUser(testUser_2);
        await addNewUser(testUser_3);
        const loginCredentials_1 = {
            loginOrEmail: testUser_1.login,
            password: testUser_1.password,
        };
        const loginCredentials_2 = {
            loginOrEmail: testUser_2.login,
            password: testUser_2.password,
        };
        const loginCredentials_3 = {
            loginOrEmail: testUser_3.login,
            password: testUser_3.password,
        };
        accessToken_1 = (
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginCredentials_1)
        ).body.accessToken;
        accessToken_2 = (
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginCredentials_2)
        ).body.accessToken;
        accessToken_3 = (
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginCredentials_3)
        ).body.accessToken;
        await setComments();
    }, 15000);

    afterAll(async () => {
        await clearAllCollections();
        await DBHandlers.closeDB();
    });

    const setComments = async () => {
        for (let i = 1; i < 20; i++) {
            await req
                .post(`${baseRoutes.posts}/${createdTestPost.id}/comments`)
                .auth(...getUserAuthData(accessToken_1))
                .send(getTestComment(i));
        }
    };

    const setTestPosts = async (blogId: string) => {
        for (let i = 1; i < 20; i++) {
            const addedPost = await addNewPost(getTestPost(i, blogId));
            if (i === 1) {
                createdTestPost = addedPost;
            }
            if (i === 2) {
                createdTestPost_2 = addedPost;
            }
        }
    };

    describe('GET /posts/:id/comments', () => {
        it('returns a list of comments', async () => {
            const response = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}/comments`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(19);
            expect(response.body.page).toEqual(1);
            expect(response.body.pagesCount).toEqual(2);
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0]).toHaveProperty('content');
            expect(response.body.items[0].content).toEqual(
                getTestComment(19).content
            );
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeGreaterThan(
                new Date(response.body.items[9].createdAt).getTime()
            );
        });

        it('returns errors if invalid search params are provided', async () => {
            const response = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}/comments?sortDirection=ascqwerty&sortBy=createdAtqwerty&pageSize=0&pageNumber=big_number`
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

        it('returns a list of comments sorted by createdAt and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}/comments?sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].content).toEqual(
                getTestComment(1).content
            );
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(2);
            expect(response.body.totalCount).toEqual(19);
        });

        it('returns a list of comments with pagination and page size 3', async () => {
            const response = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}/comments?pageSize=3&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(1);
            expect(response.body.items[2].content).toEqual(
                getTestComment(3).content
            );
        });

        it('returns a list of comments with pagination, page size 3, and page number 2', async () => {
            const response = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}/comments?pageSize=3&sortDirection=asc&pageNumber=2`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].content).toEqual(
                getTestComment(6).content
            );
        });

        it('returns a list of comments with pagination, page size 5, and page number 4', async () => {
            const response = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}/comments?pageSize=5&sortDirection=asc&pageNumber=4`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(4);
            expect(response.body.pageSize).toEqual(5);
            expect(response.body.page).toEqual(4);
            expect(response.body.items[0].content).toEqual(
                getTestComment(16).content
            );
        });
    });

    describe('POST /posts/:id/comments', () => {
        it('can not create a comment without authorization', async () => {
            const response = await req
                .post(`${baseRoutes.posts}/${createdTestPost.id}/comments`)
                .send(getTestComment(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a comment if postId is invalid', async () => {
            const response = await req
                .post(`${baseRoutes.posts}/${validObjectId}/comments`)
                .auth(...getUserAuthData(accessToken_1))
                .send(getTestComment(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it('can not create a comment if content is too short', async () => {
            const invalidComment = {
                content: 'updated',
            };
            const response = await req
                .post(`${baseRoutes.posts}/${createdTestPost.id}/comments`)
                .auth(...getUserAuthData(accessToken_1))
                .send(invalidComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('can not create a comment if content is too long', async () => {
            const invalidComment = {
                content: textWithLengthGraterThan300,
            };
            const response = await req
                .post(`${baseRoutes.posts}/${createdTestPost.id}/comments`)
                .auth(...getUserAuthData(accessToken_1))
                .send(invalidComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('create a comment', async () => {
            const response = await req
                .post(`${baseRoutes.posts}/${createdTestPost.id}/comments`)
                .auth(...getUserAuthData(accessToken_1))
                .send(getTestComment(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
        });

        it('can not create a comment if auth data is invalid', async () => {
            const response = await req
                .post(`${baseRoutes.posts}/${createdTestPost.id}/comments`)
                .auth(...getUserAuthData(inValidToken))
                .send(getTestComment(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });
    });

    describe('GET /posts', () => {
        it('returns a list of posts', async () => {
            const response = await req.get(`${baseRoutes.posts}`);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(19);
            expect(response.body.page).toEqual(1);
            expect(response.body.pagesCount).toEqual(2);
            expect(response.body.items[0]).toHaveProperty('createdAt');
            expect(response.body.items[0].title).toEqual(
                getTestPost(19, createdTestBlog.id).title
            );
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
            expect(response.body.items[0].title).toEqual(
                getTestPost(1, createdTestBlog.id).title
            );
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(2);
            expect(response.body.totalCount).toEqual(19);
        });

        it('returns a list of posts sorted by title and descending order', async () => {
            const response = await req.get(`${baseRoutes.posts}?sortBy=title`);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(
                getTestPost(9, createdTestBlog.id).title
            );
            expect(
                response.body.items[0].title > response.body.items[8].title
            ).toBeTruthy();
        });

        it('returns a list of posts sorted by title and ascending order', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?sortBy=title&sortDirection=asc`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].title).toEqual(
                getTestPost(1, createdTestBlog.id).title
            );
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
            expect(response.body.items[2].title).toEqual(
                getTestPost(3, createdTestBlog.id).title
            );
        });

        it('returns a list of posts with pagination, page size 3, and page number 2', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?pageSize=3&sortDirection=asc&pageNumber=2`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].title).toEqual(
                getTestPost(6, createdTestBlog.id).title
            );
        });

        it('returns a list of posts with pagination, page size 5, and page number 4', async () => {
            const response = await req.get(
                `${baseRoutes.posts}?pageSize=5&sortDirection=asc&pageNumber=4`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(4);
            expect(response.body.pageSize).toEqual(5);
            expect(response.body.page).toEqual(4);
            expect(response.body.items[0].title).toEqual(
                getTestPost(16, createdTestBlog.id).title
            );
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
            expect(response.body.blogName).toEqual(createdTestBlog.name);
        });

        it('returns an error if required fields are missing', async () => {
            const newPost = { ...testPost };
            for (const key of Object.keys(newPost)) {
                const updatedPost = { ...newPost };
                delete updatedPost[key as keyof typeof updatedPost];
                const response = await req
                    .post(baseRoutes.posts)
                    .auth(...validAuthData)
                    .send(updatedPost)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                expect(response.body.errorsMessages[0].field).toEqual(key);
            }
        });

        it('returns an error if title field is not valid', async () => {
            const newPost = { ...testPost };
            newPost.title = textWithLengthGraterThan30;
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
            const newPost = { ...testPost };
            newPost.shortDescription = textWithLengthGraterThan100;
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
            const newPost = { ...testPost };
            newPost.content = textWithLengthGraterThan1000;
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
            const newPost = { ...testPost };
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
            const response = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body).toEqual(
                expect.objectContaining(createdTestPost)
            );
        });

        it("returns an error if post's id is not valid", async () => {
            const response = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id.slice(1, 7)}`
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
            const updatedPost = { ...testPost, title: 'Updated Post' };
            const response_1 = await req
                .put(`${baseRoutes.posts}/${createdTestPost.id}`)
                .auth(...validAuthData)
                .send(updatedPost);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const response_2 = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}`
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
            newPost.title = textWithLengthGraterThan30;
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
            newPost.shortDescription = textWithLengthGraterThan100;

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
            newPost.content = textWithLengthGraterThan1000;
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

    describe('PUT /posts/:id/like-status', () => {
        it('can not update a  like status of post without authorization', async () => {
            const updateLikeStatus = {
                likeStatus: 'Like',
            };
            const response = await req
                .put(`${baseRoutes.posts}/${validObjectId}/like-status`)
                .send(updateLikeStatus);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not update a like status of post if auth data is invalid', async () => {
            const updateLikeStatus = {
                likeStatus: 'Like',
            };
            const response = await req
                .put(`${baseRoutes.posts}/${validObjectId}/like-status`)
                .auth(...getUserAuthData(inValidToken))
                .send(updateLikeStatus);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not update a like status of post if passed status is invalid', async () => {
            const updateLikeStatus = {
                likeStatus: 'SuperLike',
            };
            const response = await req
                .put(`${baseRoutes.posts}/${validObjectId}/like-status`)
                .auth(...getUserAuthData(accessToken_1))
                .send(updateLikeStatus);
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if post is not found', async () => {
            const updateLikeStatus = {
                likeStatus: 'Like',
            };
            const response = await req
                .put(`${baseRoutes.posts}/${validObjectId}/like-status`)
                .auth(...getUserAuthData(accessToken_1))
                .send(updateLikeStatus);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it('updates a like status of post and get post with unauthorized user and authorized user', async () => {
            const updateLikeStatus = {
                likeStatus: 'Like',
            };
            const response_1 = await req
                .put(`${baseRoutes.posts}/${createdTestPost.id}/like-status`)
                .auth(...getUserAuthData(accessToken_1))
                .send(updateLikeStatus);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);

            const response_2 = await req.get(
                `${baseRoutes.posts}/${createdTestPost.id}`
            );
            expect(response_2.body.extendedLikesInfo.likesCount).toBe(1);
            expect(response_2.body.extendedLikesInfo.dislikesCount).toBe(0);
            expect(response_2.body.extendedLikesInfo.myStatus).toBe('None');
            expect(response_2.body.extendedLikesInfo.newestLikes[0].login).toBe(
                testUser_1.login
            );

            const response_3 = await req
                .get(`${baseRoutes.posts}/${createdTestPost.id}`)
                .auth(...getUserAuthData(accessToken_1));
            expect(response_3.body.extendedLikesInfo.likesCount).toBe(1);
            expect(response_3.body.extendedLikesInfo.dislikesCount).toBe(0);
            expect(response_3.body.extendedLikesInfo.myStatus).toBe('Like');
            expect(response_2.body.extendedLikesInfo.newestLikes[0].login).toBe(
                testUser_1.login
            );
        });

        it('updates a like status of post with second user', async () => {
            const updateLikeStatus = {
                likeStatus: 'Dislike',
            };
            const response_1 = await req
                .put(`${baseRoutes.posts}/${createdTestPost.id}/like-status`)
                .auth(...getUserAuthData(accessToken_2))
                .send(updateLikeStatus);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);

            const response_2 = await req
                .get(`${baseRoutes.posts}/${createdTestPost.id}`)
                .auth(...getUserAuthData(accessToken_2));
            expect(response_2.body.extendedLikesInfo.likesCount).toBe(1);
            expect(response_2.body.extendedLikesInfo.dislikesCount).toBe(1);
            expect(response_2.body.extendedLikesInfo.myStatus).toBe('Dislike');
            expect(response_2.body.extendedLikesInfo.newestLikes[0].login).toBe(
                testUser_1.login
            );
        });

        it('updates a like status of post with third user with dislike status', async () => {
            const updateLikeStatus = {
                likeStatus: 'Dislike',
            };
            const response_1 = await req
                .put(`${baseRoutes.posts}/${createdTestPost.id}/like-status`)
                .auth(...getUserAuthData(accessToken_3))
                .send(updateLikeStatus);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);

            const response_2 = await req
                .get(`${baseRoutes.posts}/${createdTestPost.id}`)
                .auth(...getUserAuthData(accessToken_3));
            expect(response_2.body.extendedLikesInfo.likesCount).toBe(1);
            expect(response_2.body.extendedLikesInfo.dislikesCount).toBe(2);
            expect(response_2.body.extendedLikesInfo.myStatus).toBe('Dislike');
            expect(response_2.body.extendedLikesInfo.newestLikes[0].login).toBe(
                testUser_1.login
            );
        });

        it('updates a like status of post with third user from dislike to like status', async () => {
            const updateLikeStatus = {
                likeStatus: 'Like',
            };
            const response_1 = await req
                .put(`${baseRoutes.posts}/${createdTestPost.id}/like-status`)
                .auth(...getUserAuthData(accessToken_3))
                .send(updateLikeStatus);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);

            const response_2 = await req
                .get(`${baseRoutes.posts}/${createdTestPost.id}`)
                .auth(...getUserAuthData(accessToken_3));
            expect(response_2.body.extendedLikesInfo.likesCount).toBe(2);
            expect(response_2.body.extendedLikesInfo.dislikesCount).toBe(1);
            expect(response_2.body.extendedLikesInfo.myStatus).toBe('Like');
            expect(response_2.body.extendedLikesInfo.newestLikes[0].login).toBe(
                testUser_3.login
            );
            expect(response_2.body.extendedLikesInfo.newestLikes[1].login).toBe(
                testUser_1.login
            );
        });

        it('updates a like status of post with second user from dislike to like status', async () => {
            const updateLikeStatus = {
                likeStatus: 'Like',
            };
            const response_1 = await req
                .put(`${baseRoutes.posts}/${createdTestPost.id}/like-status`)
                .auth(...getUserAuthData(accessToken_2))
                .send(updateLikeStatus);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);

            const response_2 = await req
                .get(`${baseRoutes.posts}/${createdTestPost.id}`)
                .auth(...getUserAuthData(accessToken_2));
            expect(response_2.body.extendedLikesInfo.likesCount).toBe(3);
            expect(response_2.body.extendedLikesInfo.dislikesCount).toBe(0);
            expect(response_2.body.extendedLikesInfo.myStatus).toBe('Like');
            expect(response_2.body.extendedLikesInfo.newestLikes[0].login).toBe(
                testUser_3.login
            );
            expect(response_2.body.extendedLikesInfo.newestLikes[1].login).toBe(
                testUser_2.login
            );
            expect(response_2.body.extendedLikesInfo.newestLikes[2].login).toBe(
                testUser_1.login
            );
        });
    });

    describe('DELETE /posts/:id', () => {
        it('can not delete a post without authorization', async () => {
            const response = await req.delete(
                `${baseRoutes.posts}/${createdTestPost_2.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a post if auth data is invalid', async () => {
            const response = await req
                .delete(`${baseRoutes.posts}/${createdTestPost_2.id}`)
                .auth(...invalidAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('deletes a post', async () => {
            const response_1 = await req
                .delete(`${baseRoutes.posts}/${createdTestPost_2.id}`)
                .auth(...validAuthData);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const response_2 = await req.get(
                `${baseRoutes.posts}/${createdTestPost_2.id}`
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
