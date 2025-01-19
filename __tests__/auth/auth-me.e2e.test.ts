import {
    addNewUser,
    DBHandlers,
    req,
    getTestUser,
    clearAllCollections,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { RateLimiterModel } from '../../src/app/models/rate-limiter-model';
import { baseRoutes, routersPaths } from '../../src/app/configs/routes-config';
import { accessTokenExpirationTime } from '../../src/app/configs/app-config';

jest.mock('nodemailer');
jest.mock('../../src/app/configs/app-config', () => ({
    ...jest.requireActual('../../src/app/configs/app-config'),
    accessTokenExpirationTime: 1,
    refreshTokenExpirationTime: 2,
}));

describe('Auth Controller', () => {
    const testUser = getTestUser(1);

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

        it('get user details successfully', async () => {
            const response = await req
                .get(`${baseRoutes.auth}${routersPaths.auth.me}`)
                .auth(accessToken, { type: 'bearer' });
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.userId).toBeDefined();
            expect(response.body.email).toBe(testUser.email);
            expect(response.body.login).toBe(testUser.login);
        });

        it('returns an error if access token is expired', async () => {
            await new Promise((resolve) =>
                setTimeout(resolve, accessTokenExpirationTime * 1000)
            );
            const response = await req
                .get(`${baseRoutes.auth}${routersPaths.auth.me}`)
                .auth(accessToken, { type: 'bearer' });
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if no authentication provided', async () => {
            const response = await req.get(`${baseRoutes.auth}/me`);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if token is not valid', async () => {
            const inValidToken = 'qw123' + accessToken;
            const response = await req
                .get(`${baseRoutes.auth}${routersPaths.auth.me}`)
                .auth(inValidToken, { type: 'bearer' });
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });
    });
});
