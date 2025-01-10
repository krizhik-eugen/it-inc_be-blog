import { baseRoutes, rateLimiterMaxRequests } from '../../src/app/configs';
import {
    addNewUser,
    DBHandlers,
    req,
    getTestUser,
    clearAllCollections,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { routersPaths } from '../../src/app/configs';
import { RateLimiterModel } from '../../src/app/models/rate-limiter';

jest.mock('nodemailer');
jest.mock('../../src/app/configs', () => ({
    ...jest.requireActual('../../src/app/configs'),
    accessTokenExpirationTime: 1,
    refreshTokenExpirationTime: 2,
}));

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
        await clearAllCollections();
        await DBHandlers.closeDB();
    });

    afterEach(async () => {
        await RateLimiterModel.deleteMany({});
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
                .send(loginCredentials)
                .expect(HTTP_STATUS_CODES.OK)
                .expect('set-cookie', /refreshToken/);
            expect(response.body.accessToken).toBeDefined();
        });

        it('returns an error if rate limit is exceeded ', async () => {
            const loginUser = {
                ...loginCredentials,
            };
            loginUser.password = 'wrongPassword';
            let response;
            for (let i = 1; i <= rateLimiterMaxRequests + 1; i++) {
                response = await req
                    .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                    .send(loginUser);
            }
            expect(response?.status).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
        });
    });
});
