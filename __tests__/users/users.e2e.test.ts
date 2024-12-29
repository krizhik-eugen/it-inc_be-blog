import { baseRoutes } from '../../src/app/configs';
import {
    addNewUser,
    DBHandlers,
    idValidationErrorMessages,
    invalidAuthData,
    invalidObjectId,
    req,
    getTestUser,
    usersValidationErrorMessages,
    validAuthData,
    validObjectId,
    textWithLengthGraterThan30,
    textWithLengthGraterThan20,
    invalidEmailFormat,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { usersRepository, UserViewModel } from '../../src/features/users';
import { testingService } from '../../src/features/testing';

describe('Users Controller', () => {
    const setTestUsers = async () => {
        for (let i = 1; i < 10; i++) {
            const user = getTestUser(i);
            await addNewUser(user);
        }
    };

    beforeAll(async () => {
        await DBHandlers.connectToDB();
        await usersRepository.clearUsers();
        await setTestUsers();
    }, 10000);

    afterAll(async () => {
        await testingService.deleteAllData();
        await DBHandlers.closeDB();
    });

    describe('GET /users', () => {
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

        it('returns a list of users sorted by createdAt and descending order by default', async () => {
            const response = await req
                .get(baseRoutes.users)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].login).toEqual(getTestUser(9).login);
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
            const response = await req
                .get(`${baseRoutes.users}?sortDirection=asc`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].login).toEqual(getTestUser(1).login);
            expect(
                new Date(response.body.items[0].createdAt).getTime()
            ).toBeLessThan(
                new Date(response.body.items[8].createdAt).getTime()
            );
            expect(response.body.pagesCount).toEqual(1);
            expect(response.body.totalCount).toEqual(9);
        });

        it('returns a list of users sorted by login and descending order', async () => {
            const response = await req
                .get(`${baseRoutes.users}?sortBy=login`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].login).toEqual(getTestUser(9).login);
            expect(
                response.body.items[0].login > response.body.items[8].login
            ).toBeTruthy();
        });

        it('returns a list of users sorted by login and ascending order', async () => {
            const response = await req
                .get(`${baseRoutes.users}?sortBy=login&sortDirection=asc`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].login).toEqual(getTestUser(1).login);
            expect(
                response.body.items[8].login > response.body.items[0].login
            ).toBeTruthy();
        });

        it('returns a list of users sorted by email and descending order', async () => {
            const response = await req
                .get(`${baseRoutes.users}?sortBy=email`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].email).toEqual(getTestUser(9).email);
            expect(
                response.body.items[0].email > response.body.items[8].email
            ).toBeTruthy();
        });

        it('returns a list of users sorted by email and ascending order', async () => {
            const response = await req
                .get(`${baseRoutes.users}?sortBy=email&sortDirection=asc`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items[0].email).toEqual(getTestUser(1).email);
            expect(
                response.body.items[8].email > response.body.items[0].email
            ).toBeTruthy();
        });

        it('returns a list of users with pagination and page size 3', async () => {
            const response = await req
                .get(`${baseRoutes.users}?pageSize=3&sortDirection=asc`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.totalCount).toEqual(9);
            expect(response.body.page).toEqual(1);
            expect(response.body.items[2].login).toEqual(getTestUser(3).login);
        });

        it('returns a list of users with pagination, page size 3, and page number 2', async () => {
            const response = await req
                .get(
                    `${baseRoutes.users}?pageSize=3&sortDirection=asc&pageNumber=2`
                )
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(3);
            expect(response.body.pageSize).toEqual(3);
            expect(response.body.page).toEqual(2);
            expect(response.body.items[2].login).toEqual(getTestUser(6).login);
        });

        it('returns a list of users with pagination, page size 4, and page number 3', async () => {
            const response = await req
                .get(
                    `${baseRoutes.users}?pageSize=4&sortDirection=asc&pageNumber=3`
                )
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.items.length).toEqual(1);
            expect(response.body.pageSize).toEqual(4);
            expect(response.body.page).toEqual(3);
            expect(response.body.items[0].login).toEqual(getTestUser(9).login);
        });

        it('returns a list of users with the login matching the search term', async () => {
            await addNewUser({
                login: 'login10',
                email: 'email10@email.com',
                password: 'password10',
            });
            await addNewUser({
                login: 'login11',
                email: 'email11@email.com',
                password: 'password11',
            });
            await addNewUser({
                login: 'login12',
                email: 'email12@email.com',
                password: 'password12',
            });
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
            //using newly added users from previous test
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
            await usersRepository.clearUsers();
            await setTestUsers();
            await addNewUser({
                login: 'login10',
                email: 'email10@email.com',
                password: 'password10',
            });
            await addNewUser({
                login: 'login11',
                email: 'email11@email.com',
                password: 'password11',
            });
            await addNewUser({
                login: 'login111',
                email: 'email111@email.com',
                password: 'password111',
            });
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
        }, 10000);
    });

    describe('POST /users', () => {
        const newUser = {
            email: 'email_100@email.com',
            login: 'login_100',
            password: 'password100',
        };

        it('can not create a new user without authorization', async () => {
            const response = await req
                .post(baseRoutes.users)
                .send(getTestUser(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not create a user if auth data is invalid', async () => {
            const response = await req
                .post(baseRoutes.users)
                .auth(...invalidAuthData)
                .send(getTestUser(1));
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('creates a new user', async () => {
            const response = await req
                .post(baseRoutes.users)
                .auth(...validAuthData)
                .send(newUser);
            expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
            expect(response.body.login).toEqual(newUser.login);
            expect(response.body.email).toEqual(newUser.email);
        });

        it('returns an error if required password field is missing', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.password = '';
            const response = await req
                .post(baseRoutes.users)
                .auth(...validAuthData)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('password');
        });

        it('returns an error if login field is not valid', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.login = textWithLengthGraterThan30;
            const response = await req
                .post(baseRoutes.users)
                .auth(...validAuthData)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('login');
            expect(response.body.errorsMessages[0].message).toEqual(
                usersValidationErrorMessages.login.length
            );
        });

        it('returns an error if password field is not valid', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.password = textWithLengthGraterThan20;
            const response = await req
                .post(baseRoutes.users)
                .auth(...validAuthData)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('password');
            expect(response.body.errorsMessages[0].message).toEqual(
                usersValidationErrorMessages.password.length
            );
        });

        it('returns an error if email field is not valid', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.email = invalidEmailFormat;
            const response = await req
                .post(baseRoutes.users)
                .auth(...validAuthData)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
            expect(response.body.errorsMessages[0].message).toEqual(
                usersValidationErrorMessages.email.format
            );
        });
    });

    describe('DELETE /users/:id', () => {
        const newUserToDelete = {
            email: 'email_101@email.com',
            login: 'login_101',
            password: 'password101',
        };
        let createdUserToDelete: UserViewModel;
        beforeAll(async () => {
            createdUserToDelete = await addNewUser(newUserToDelete);
        });
        it('can not delete a user without authorization', async () => {
            const response = await req.delete(
                `${baseRoutes.users}/${createdUserToDelete.id}`
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('can not delete a user if auth data is invalid', async () => {
            const response = await req
                .delete(`${baseRoutes.users}/${createdUserToDelete.id}`)
                .auth(...invalidAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('deletes a user', async () => {
            const response_1 = await req
                .delete(`${baseRoutes.users}/${createdUserToDelete.id}`)
                .auth(...validAuthData);
            expect(response_1.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            const response_2 = await req.get(
                `${baseRoutes.users}/${createdUserToDelete.id}`
            );
            expect(response_2.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });

        it("returns an error if user's id is not valid", async () => {
            const response = await req
                .delete(`${baseRoutes.users}/${invalidObjectId}`)
                .auth(...validAuthData);
            expect(response.body.errorsMessages[0].message).toEqual(
                idValidationErrorMessages
            );
            expect(response.status).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        });

        it('returns an error if user is not found', async () => {
            const response = await req
                .delete(`${baseRoutes.users}/${validObjectId}`)
                .auth(...validAuthData);
            expect(response.status).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        });
    });
});
