import { baseRoutes } from '../../src/configs';
import {
    addNewUser,
    DBHandlers,
    invalidAuthData,
    invalidObjectId,
    req,
    testUsers,
    validAuthData,
    validObjectId,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { usersRepository, UserViewModel } from '../../src/users';

describe('Users Controller', () => {
    beforeAll(async () => {
        await DBHandlers.connectToDB();
    });

    afterAll(async () => {
        await DBHandlers.closeDB();
    });

    beforeEach(async () => {
        await usersRepository.setUsers([]);
    });

    const setTestUsers = async () => {
        for (let i = 0; i < testUsers.length; i++) {
            await addNewUser({ ...testUsers[i] });
        }
    };

    describe('GET /users', () => {
        beforeEach(async () => {});

        it('can not get a list of users without authorization', async () => {
            const response = await req.get(baseRoutes.users);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not get a list of users if auth data is invalid', async () => {
            const response = await req
                .get(baseRoutes.users)
                .auth(...invalidAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an empty array initially', async () => {
            await usersRepository.setUsers([]);
            const response = await req
                .get(baseRoutes.users)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(0);
            expect(response.body.items).toEqual([]);
        });

        it('returns a list of users after creating one', async () => {
            await addNewUser({ ...testUsers[0] });
            const response = await req
                .get(baseRoutes.users)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.totalCount).toEqual(1);
            expect(response.body.page).toEqual(1);
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.items[0]).toHaveProperty('createdAt');
        });

        it('returns a list of users sorted by createdAt and descending order by default', async () => {
            await setTestUsers();
            const response = await req
                .get(baseRoutes.users)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].login).toEqual(testUsers[8].login);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeGreaterThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.totalCount).toEqual(9);
            expect(response.body.items[0]).toHaveProperty('createdAt');
        });

        it('returns errors if invalid search params are provided', async () => {
            await setTestUsers();
            const response = await req
                .get(
                    `${baseRoutes.users}?sortDirection=ascqwerty&sortBy=createdAtqwerty&pageSize=0&pageNumber=big_number`
                )
                .auth(...validAuthData);
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

        it('returns a list of users sorted by createdAt and ascending order', async () => {
            await setTestUsers();
            const response = await req
                .get(`${baseRoutes.users}?sortDirection=asc`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].login).toEqual(testUsers[0].login);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.totalCount).toEqual(9);
        });

        it('returns a list of users sorted by login and descending order', async () => {
            await setTestUsers();
            const response = await req
                .get(`${baseRoutes.users}?sortBy=login`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].login).toEqual(testUsers[8].login);
            expect(
                response.body.items[0].login > response.body.items[8].login
            ).toBeTruthy();
        });

        it('returns a list of users sorted by login and ascending order', async () => {
            await setTestUsers();
            const response = await req
                .get(`${baseRoutes.users}?sortBy=login&sortDirection=asc`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].login).toEqual(testUsers[0].login);
            expect(
                response.body.items[8].login > response.body.items[0].login
            ).toBeTruthy();
        });

        it('returns a list of users sorted by email and descending order', async () => {
            await setTestUsers();
            const response = await req
                .get(`${baseRoutes.users}?sortBy=email`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].email).toEqual(testUsers[8].email);
            expect(
                response.body.items[0].email > response.body.items[8].email
            ).toBeTruthy();
        });

        it('returns a list of users sorted by email and ascending order', async () => {
            await setTestUsers();
            const response = await req
                .get(`${baseRoutes.users}?sortBy=email&sortDirection=asc`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].email).toEqual(testUsers[0].email);
            expect(
                response.body.items[8].email > response.body.items[0].email
            ).toBeTruthy();
        });

        it('returns a list of users with pagination and page size 3', async () => {
            await setTestUsers();
            const response = await req
                .get(`${baseRoutes.users}?pageSize=3&sortDirection=asc`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(1);
            expect(response.body.items[2].login).toEqual(testUsers[2].login);
        });

        it('returns a list of users with pagination, page size 3, and page number 2', async () => {
            await setTestUsers();
            const response = await req
                .get(
                    `${baseRoutes.users}?pageSize=3&sortDirection=asc&pageNumber=2`
                )
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].login).toEqual(testUsers[5].login);
        });

        it('returns a list of users with pagination, page size 4, and page number 3', async () => {
            await setTestUsers();
            const response = await req
                .get(
                    `${baseRoutes.users}?pageSize=4&sortDirection=asc&pageNumber=3`
                )
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(1);
            expect(response.body.pageSize).toEqual(4);
            expect(response.body.page).toEqual(3);
            expect(response.body.items[0].login).toEqual(testUsers[8].login);
        });

        it('returns a list of users with the login matching the search term', async () => {
            await setTestUsers();
            await usersRepository.setUsers([
                {
                    login: 'login10',
                    email: 'email10@email.com',
                    password: 'password10',
                },
                {
                    login: 'login11',
                    email: 'email11@email.com',
                    password: 'password11',
                },
                {
                    login: 'login12',
                    email: 'email12@email.com',
                    password: 'password12',
                },
            ]);
            const response_1 = await req
                .get(`${baseRoutes.users}?searchLoginTerm=login`)
                .auth(...validAuthData);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_1.body.totalCount).toEqual(12);
            const response_2 = await req
                .get(`${baseRoutes.users}?searchLoginTerm=login1`)
                .auth(...validAuthData);
            expect(response_2.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_2.body.totalCount).toEqual(3);
            ['login10', 'login11', 'login12'].forEach((login) => {
                expect(
                    response_2.body.items.some(
                        (user: UserViewModel) => user.login === login
                    )
                ).toBeTruthy();
            });
        });

        it('returns a list of users with the email matching the search term', async () => {
            await setTestUsers();
            await usersRepository.setUsers([
                {
                    login: 'login10',
                    email: 'email10@email.com',
                    password: 'password10',
                },
                {
                    login: 'login11',
                    email: 'email11@email.com',
                    password: 'password11',
                },
                {
                    login: 'login12',
                    email: 'email12@email.com',
                    password: 'password12',
                },
            ]);
            const response_1 = await req
                .get(`${baseRoutes.users}?searchEmailTerm=email`)
                .auth(...validAuthData);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_1.body.totalCount).toEqual(12);
            const response_2 = await req
                .get(`${baseRoutes.users}?searchEmailTerm=email1`)
                .auth(...validAuthData);
            expect(response_2.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_2.body.totalCount).toEqual(3);
            [
                'email10@email.com',
                'email11@email.com',
                'email12@email.com',
            ].forEach((email) => {
                expect(
                    response_2.body.items.some(
                        (user: UserViewModel) => user.email === email
                    )
                ).toBeTruthy();
            });
        });

        it('returns a list of users with the email and login matching the search term', async () => {
            await setTestUsers();
            await usersRepository.setUsers([
                {
                    login: 'login10',
                    email: 'email10@email.com',
                    password: 'password10',
                },
                {
                    login: 'login11',
                    email: 'email11@email.com',
                    password: 'password11',
                },
                {
                    login: 'login111',
                    email: 'email111@email.com',
                    password: 'password12',
                },
            ]);
            const response_1 = await req
                .get(
                    `${baseRoutes.users}?searchEmailTerm=email&searchLoginTerm=login`
                )
                .auth(...validAuthData);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_1.body.totalCount).toEqual(12);
            const response_2 = await req
                .get(
                    `${baseRoutes.users}?searchEmailTerm=email11&searchLoginTerm=login1`
                )
                .auth(...validAuthData);
            expect(response_2.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response_2.body.totalCount).toEqual(3);
            [
                'email10@email.com',
                'email11@email.com',
                'email111@email.com',
            ].forEach((email) => {
                expect(
                    response_2.body.items.some(
                        (user: UserViewModel) => user.email === email
                    )
                ).toBeTruthy();
            });
        });
    });

    describe('POST /users', () => {
        it('can not create a new user without authorization', async () => {
            const response = await req.post(baseRoutes.users).send(testUsers[0]);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a user if auth data is invalid', async () => {
            const response = await req
                .post(baseRoutes.users)
                .auth(...invalidAuthData)
                .send(testUsers[0]);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new user', async () => {
            const response = await req
                .post(baseRoutes.users)
                .auth(...validAuthData)
                .send(testUsers[0]);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body.login).toEqual(testUsers[0].login);
            expect(response.body.email).toEqual(testUsers[0].email);
        });

        // it('returns an error if required fields are missing', async () => {
        //     (Object.keys(testPost) as (keyof typeof testPost)[]).forEach(
        //         async (key) => {
        //             const newPost = { ...testPost };
        //             delete newPost[key];
        //             const response = await req
        //                 .post(baseRoutes.users)
        //                 .auth(...validAuthData)
        //                 .send(newPost)
        //                 .expect(HTTP_STATUS_CODES.BAD_REQUEST);
        //             expect(response.body.errorsMessages[0].field).toEqual(key);
        //         }
        //     );
        // });

        // it('returns an error if title field is not valid', async () => {
        //     const newPost = {
        //         ...testPost,
        //     };

        //     newPost.title = invalidPostsFields.title.length;

        //     const response = await req
        //         .post(baseRoutes.users)
        //         .auth(...validAuthData)
        //         .send(newPost)
        //         .expect(HTTP_STATUS_CODES.BAD_REQUEST);
        //     expect(response.body.errorsMessages[0].field).toEqual('title');
        //     expect(response.body.errorsMessages[0].message).toEqual(
        //         postsValidationErrorMessages.title.length
        //     );
        // });

        // it('returns an error if shortDescription field is not valid', async () => {
        //     const newPost = {
        //         ...testPost,
        //     };

        //     newPost.shortDescription =
        //         invalidPostsFields.shortDescription.length;

        //     const response = await req
        //         .post(baseRoutes.users)
        //         .auth(...validAuthData)
        //         .send(newPost)
        //         .expect(HTTP_STATUS_CODES.BAD_REQUEST);
        //     expect(response.body.errorsMessages[0].field).toEqual(
        //         'shortDescription'
        //     );
        //     expect(response.body.errorsMessages[0].message).toEqual(
        //         postsValidationErrorMessages.shortDescription.length
        //     );
        // });

        // it('returns an error if content field is not valid', async () => {
        //     const newPost = {
        //         ...testPost,
        //     };

        //     newPost.content = invalidPostsFields.content.length;

        //     const response = await req
        //         .post(baseRoutes.users)
        //         .auth(...validAuthData)
        //         .send(newPost)
        //         .expect(HTTP_STATUS_CODES.BAD_REQUEST);
        //     expect(response.body.errorsMessages[0].field).toEqual('content');
        //     expect(response.body.errorsMessages[0].message).toEqual(
        //         postsValidationErrorMessages.content.length
        //     );
        // });

        // it('returns an error if blogId field is not valid', async () => {
        //     const newPost = {
        //         ...testPost,
        //     };

        //     newPost.blogId = invalidObjectId;

        //     const response_1 = await req
        //         .post(baseRoutes.users)
        //         .auth(...validAuthData)
        //         .send(newPost)
        //         .expect(HTTP_STATUS_CODES.BAD_REQUEST);
        //     expect(response_1.body.errorsMessages[0].field).toEqual('blogId');
        //     expect(response_1.body.errorsMessages[0].message).toEqual(
        //         postsValidationErrorMessages.blogId.format
        //     );

        //     newPost.blogId = validObjectId;

        //     const response_2 = await req
        //         .post(baseRoutes.users)
        //         .auth(...validAuthData)
        //         .send(newPost)
        //         .expect(HTTP_STATUS_CODES.BAD_REQUEST);
        //     expect(response_2.body.errorsMessages[0].field).toEqual('blogId');
        //     expect(response_2.body.errorsMessages[0].message).toEqual(
        //         postsValidationErrorMessages.blogId.value
        //     );
        // });
    });

    // describe('DELETE /users/:id', () => {
    //     it('can not delete a post without authorization', async () => {
    //         const createdPost = await addNewPost(testPost);
    //         const response = await req.delete(
    //             `${baseRoutes.users}/${createdPost.id}`
    //         );
    //         expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
    //     });

    //     it('can not delete a post if auth data is invalid', async () => {
    //         const createdPost = await addNewPost(testPost);
    //         const response = await req
    //             .delete(`${baseRoutes.users}/${createdPost.id}`)
    //             .auth(...invalidAuthData);
    //         expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
    //     });

    //     it('deletes a post', async () => {
    //         const createdPost = await addNewPost(testPost);
    //         const response_1 = await req
    //             .delete(`${baseRoutes.users}/${createdPost.id}`)
    //             .auth(...validAuthData);
    //         expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
    //         const response_2 = await req.get(
    //             `${baseRoutes.users}/${createdPost.id}`
    //         );
    //         expect(response_2.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
    //     });

    //     it("returns an error if post's id is not valid", async () => {
    //         const response = await req
    //             .delete(`${baseRoutes.users}/${invalidObjectId}`)
    //             .auth(...validAuthData);
    //         expect(response.body.errorsMessages[0].message).toEqual(
    //             postsValidationErrorMessages.id.format
    //         );
    //         expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
    //     });

    //     it('returns an error if post is not found', async () => {
    //         const response = await req
    //             .delete(`${baseRoutes.users}/${validObjectId}`)
    //             .auth(...validAuthData);
    //         expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
    //     });
    // });
});
