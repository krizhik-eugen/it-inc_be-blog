import { baseRoutes, routersPaths } from '../../src/app/configs';
import {
    PostCreateRequestModel,
    PostViewModel,
} from '../../src/features/posts';
import { BlogViewModel } from '../../src/features/blogs';
import {
    addNewBlog,
    addNewPost,
    addNewUser,
    DBHandlers,
    getTestBlog,
    getTestComment,
    getTestPost,
    getTestUser,
    getUserAuthData,
    idValidationErrorMessages,
    req,
    textWithLengthGraterThan300,
    validObjectId,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { CommentViewModel } from '../../src/features/comments';
import { testingService } from '../../src/features/testing';

describe('Comments Controller', () => {
    let createdTestBlog: BlogViewModel;
    let testPost: PostCreateRequestModel;
    const testComment = getTestComment(1);
    let createdPost: PostViewModel;
    let accessToken_1 = '';
    let accessToken_2 = '';
    let addedComment_1: CommentViewModel;
    let addedComment_2: CommentViewModel;
    let addedUserId_1 = '';
    let addedUserId_2 = '';
    const inValidToken = 'qw123' + accessToken_1;

    beforeAll(async () => {
        // init data for tests: create Blog, Post, Users
        await DBHandlers.connectToDB();
        createdTestBlog = await addNewBlog(getTestBlog(1));
        testPost = getTestPost(1, createdTestBlog.id);
        createdPost = await addNewPost(testPost);
        addedUserId_1 = (await addNewUser(getTestUser(1))).id;
        addedUserId_2 = (await addNewUser(getTestUser(2))).id;
        const loginCredentials_1 = {
            loginOrEmail: getTestUser(1).login,
            password: getTestUser(1).password,
        };
        const loginCredentials_2 = {
            loginOrEmail: getTestUser(2).login,
            password: getTestUser(2).password,
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
        addedComment_1 = (
            await req
                .post(`${baseRoutes.posts}/${createdPost.id}/comments`)
                .auth(...getUserAuthData(accessToken_1))
                .send(testComment)
        ).body;
        addedComment_2 = (
            await req
                .post(`${baseRoutes.posts}/${createdPost.id}/comments`)
                .auth(...getUserAuthData(accessToken_2))
                .send(testComment)
        ).body;
    });

    afterAll(async () => {
        await testingService.deleteAllData();
        await DBHandlers.closeDB();
    });

    describe('GET /comments/:id', () => {
        it("returns an error if comment's id is not valid", async () => {
            const response = await req.get(
                `${baseRoutes.comments}/${addedComment_1.id.slice(1, 7)}`
            );
            expect(response.body.errorsMessages[0].message).toEqual(
                idValidationErrorMessages
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if comment is not found', async () => {
            const response = await req.get(
                `${baseRoutes.comments}/${validObjectId}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it('returns a post by id', async () => {
            const response_1 = await req.get(
                `${baseRoutes.comments}/${addedComment_1.id}`
            );
            expect(response_1.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_1.body.content).toBe(testComment.content);
            expect(response_1.body.commentatorInfo.userId).toBe(addedUserId_1);
            expect(response_1.body.commentatorInfo.userId).not.toBe(
                addedUserId_2
            );

            const response_2 = await req.get(
                `${baseRoutes.comments}/${addedComment_2.id}`
            );
            expect(response_2.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_2.body.content).toBe(testComment.content);
            expect(response_2.body.commentatorInfo.userId).not.toBe(
                addedUserId_1
            );
            expect(response_2.body.commentatorInfo.userId).toBe(addedUserId_2);
        });
    });

    describe('PUT /comments/:id', () => {
        it('can not update a comment without authorization', async () => {
            const updatedComment = {
                content: addedComment_1.content + ' updated',
            };
            const response = await req
                .put(`${baseRoutes.comments}/${addedComment_1.id}`)
                .send(updatedComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not update a comment if auth data is invalid', async () => {
            const updatedComment = {
                content: addedComment_1.content + ' updated',
            };
            const response = await req
                .put(`${baseRoutes.comments}/${addedComment_1.id}`)
                .auth(...getUserAuthData(inValidToken))
                .send(updatedComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not update a comment if user is not author', async () => {
            const updatedComment = {
                content: addedComment_1.content + ' updated',
            };
            const response = await req
                .put(`${baseRoutes.comments}/${addedComment_1.id}`)
                .auth(...getUserAuthData(accessToken_2))
                .send(updatedComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.FORBIDDEN);
        });

        it('return an error if comment not found', async () => {
            const updatedComment = {
                content: addedComment_1.content + ' updated',
            };
            const response = await req
                .put(`${baseRoutes.comments}/${validObjectId}`)
                .auth(...getUserAuthData(accessToken_1))
                .send(updatedComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it('can not update a comment if content is too short', async () => {
            const updatedComment = {
                content: 'updated',
            };
            const response = await req
                .put(`${baseRoutes.comments}/${addedComment_1.id}`)
                .auth(...getUserAuthData(accessToken_1))
                .send(updatedComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('can not update a comment if content is too long', async () => {
            const updatedComment = {
                content: textWithLengthGraterThan300,
            };
            const response = await req
                .put(`${baseRoutes.comments}/${addedComment_1.id}`)
                .auth(...getUserAuthData(accessToken_1))
                .send(updatedComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('update a comment', async () => {
            const updatedComment = {
                content: addedComment_1.content + ' updated',
            };
            const response = await req
                .put(`${baseRoutes.comments}/${addedComment_1.id}`)
                .auth(...getUserAuthData(accessToken_1))
                .send(updatedComment);
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        });
    });

    describe('DELETE /posts/:id', () => {
        it('can not delete a comment without authorization', async () => {
            const response = await req.delete(
                `${baseRoutes.comments}/${addedComment_1.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a comment if auth data is invalid', async () => {
            const response = await req
                .delete(`${baseRoutes.comments}/${addedComment_1.id}`)
                .auth(...getUserAuthData(inValidToken));
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a comment if user is not author', async () => {
            const response = await req
                .delete(`${baseRoutes.comments}/${addedComment_1.id}`)
                .auth(...getUserAuthData(accessToken_2));
            expect(response.status).toBe(HTTP_STATUS_CODES.FORBIDDEN);
        });

        it('return an error if comment not found', async () => {
            const response = await req
                .delete(`${baseRoutes.comments}/${validObjectId}`)
                .auth(...getUserAuthData(accessToken_2));
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it('delete a comment', async () => {
            const response = await req
                .delete(`${baseRoutes.comments}/${addedComment_1.id}`)
                .auth(...getUserAuthData(accessToken_1));
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
        });
    });
});
