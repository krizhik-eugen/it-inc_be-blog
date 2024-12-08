import { baseRoutes } from '../../src/configs';
import { addNewUser, DBHandlers, req, testUsers } from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { usersRepository } from '../../src/users';

describe('Auth Controller', () => {
    beforeAll(async () => {
        await DBHandlers.connectToDB();
        await addNewUser({ ...testUsers[0] });
    });

    afterAll(async () => {
        await usersRepository.setUsers([]);
        await DBHandlers.closeDB();
    });

    describe('POST /login', () => {
        const loginCredentials = {
            loginOrEmail: testUsers[0].login,
            password: testUsers[0].password,
        };

        it('returns an error if required fields are missing', async () => {
            for (const key of Object.keys(
                loginCredentials
            ) as (keyof typeof loginCredentials)[]) {
                const loginUser = { ...loginCredentials };
                delete loginUser[key];
                const response = await req
                    .post(`${baseRoutes.auth}/login`)
                    .send(loginUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                expect(response.body.errorsMessages[0].field).toEqual(key);
            }
        });

        it('returns an error if loginOrEmail field is not valid', async () => {
            const loginUser = {
                ...loginCredentials,
            };
            loginUser.loginOrEmail = 'invalidLoginOrEmail';
            const response = await req
                .post(`${baseRoutes.auth}/login`)
                .send(loginUser)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
            expect(response.body.errorsMessages[0].message).toEqual(
                'Incorrect login or password'
            );
        });

        it('returns an error if password field is not valid', async () => {
            const loginUser = {
                ...loginCredentials,
            };
            loginUser.password = 'wrongPassword';
            const response = await req
                .post(`${baseRoutes.auth}/login`)
                .send(loginUser)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
            expect(response.body.errorsMessages[0].message).toEqual(
                'Incorrect login or password'
            );
        });

        it('login successfully', async () => {
            const response = await req
                .post(`${baseRoutes.auth}/login`)
                .send(loginCredentials);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.accessToken).toBeDefined();
        });
    });

    describe.only('GET /me', () => {
        let accessToken = '';
        beforeAll(async () => {
            const loginCredentials = {
                loginOrEmail: testUsers[0].login,
                password: testUsers[0].password,
            };
            accessToken = (
                await req
                    .post(`${baseRoutes.auth}/login`)
                    .send(loginCredentials)
            ).body.accessToken;
        });

        it('returns an error if no authentication provided', async () => {
            const response = await req.get(`${baseRoutes.auth}/me`);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if token is not valid', async () => {
            const inValidToken = accessToken + '123';
            const response = await req
                .get(`${baseRoutes.auth}/me`)
                .auth(inValidToken, { type: 'bearer' });
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('get user details successfully', async () => {
            const response = await req
                .get(`${baseRoutes.auth}/me`)
                .auth(accessToken, { type: 'bearer' });
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.userId).toBeDefined();
            expect(response.body.email).toBe(testUsers[0].email);
            expect(response.body.login).toBe(testUsers[0].login);
        });
    });
});
