import { baseRoutes } from '../../src/app/configs';
import { addNewUser, DBHandlers, req, getTestUser } from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { usersRepository } from '../../src/domain/users';
import { routersPaths } from '../../src/app/configs';

describe('Auth Controller', () => {
    const testUser = getTestUser(1);
    const loginCredentials = {
        loginOrEmail: testUser.login,
        password: testUser.password,
    };

    beforeAll(async () => {
        await DBHandlers.connectToDB();
        await addNewUser(testUser);
    });

    afterAll(async () => {
        await usersRepository.clearUsers();
        await DBHandlers.closeDB();
    });

    describe('POST /login', () => {
        it('returns an error if required fields are missing', async () => {
            for (const key of Object.keys(
                loginCredentials
            ) as (keyof typeof loginCredentials)[]) {
                const loginUser = { ...loginCredentials };
                delete loginUser[key];
                const response = await req
                    .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
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
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginUser)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if password field is not valid', async () => {
            const loginUser = {
                ...loginCredentials,
            };
            loginUser.password = 'wrongPassword';
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginUser)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('login successfully', async () => {
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginCredentials);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.accessToken).toBeDefined();
        });
    });

    describe('GET /me', () => {
        let accessToken = '';
        beforeAll(async () => {
            const loginCredentials = {
                loginOrEmail: testUser.login,
                password: testUser.password,
            };
            accessToken = (
                await req
                    .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
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
                .get(`${baseRoutes.auth}${routersPaths.auth.me}`)
                .auth(inValidToken, { type: 'bearer' });
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('get user details successfully', async () => {
            const response = await req
                .get(`${baseRoutes.auth}${routersPaths.auth.me}`)
                .auth(accessToken, { type: 'bearer' });
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.userId).toBeDefined();
            expect(response.body.email).toBe(testUser.email);
            expect(response.body.login).toBe(testUser.login);
        });
    });
});
