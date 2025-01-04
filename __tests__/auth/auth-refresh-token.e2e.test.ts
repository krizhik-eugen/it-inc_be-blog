import {
    accessTokenExpirationTime,
    baseRoutes,
    refreshTokenExpirationTime,
} from '../../src/app/configs';
import { addNewUser, DBHandlers, req, getTestUser } from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { routersPaths } from '../../src/app/configs';
import { rateLimiterRepository } from '../../src/app/repositories';
import { testingService } from '../../src/features/testing';

jest.mock('nodemailer');
jest.mock('../../src/app/configs', () => ({
    ...jest.requireActual('../../src/app/configs'),
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
        await testingService.deleteAllData();
        await DBHandlers.closeDB();
    });

    afterEach(async () => {
        await rateLimiterRepository.clearRateLimiter();
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
