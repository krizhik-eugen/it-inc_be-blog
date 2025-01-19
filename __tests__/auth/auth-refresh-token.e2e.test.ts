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
import {
    accessTokenExpirationTime,
    refreshTokenExpirationTime,
} from '../../src/app/configs/app-config';

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

    describe('POST /refresh-token', () => {
        let accessToken = '';
        let sessionCookie = '';
        let updatedSessionCookie = '';

        beforeAll(async () => {
            const loginCredentials = {
                loginOrEmail: testUser.login,
                password: testUser.password,
            };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginCredentials);
            accessToken = response.body.accessToken;
            sessionCookie = response.get('set-cookie') || '';
        });

        it('updates tokens successfully', async () => {
            //need to wait for generating different tokens from login in beforeAll
            await new Promise((resolve) =>
                setTimeout(resolve, accessTokenExpirationTime * 1000)
            );
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.refreshToken}`)
                .set('Cookie', sessionCookie)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response.body.accessToken).toBeDefined();
            expect(response.body.accessToken).not.toEqual(accessToken);
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie']).not.toEqual(sessionCookie);

            updatedSessionCookie = response.get('set-cookie') || '';
        });

        it('return an error while using revoked refresh token', async () => {
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.refreshToken}`)
                .set('Cookie', sessionCookie)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('return an error if refresh token is expired', async () => {
            await new Promise((resolve) =>
                setTimeout(resolve, (refreshTokenExpirationTime + 1) * 1000)
            );
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.refreshToken}`)
                .set('Cookie', updatedSessionCookie)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });
    });
});
