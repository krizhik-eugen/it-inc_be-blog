import {
    addNewUser,
    DBHandlers,
    req,
    getTestUser,
    clearAllCollections,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { RateLimiterModel } from '../../src/app/models/rate-limiter-model';
import { refreshTokenExpirationTime } from '../../src/app/configs/app-config';
import { baseRoutes, routersPaths } from '../../src/app/configs/routes-config';

jest.mock('nodemailer');
jest.mock('../../src/app/configs/app-config', () => ({
    ...jest.requireActual('../../src/app/configs/app-config'),
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

    describe('POST /logout', () => {
        let sessionCookie: string;

        beforeEach(async () => {
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginCredentials);
            sessionCookie = response.get('set-cookie') || '';
        });

        it('returns an error if session token is expired', async () => {
            await new Promise((resolve) =>
                setTimeout(resolve, refreshTokenExpirationTime * 1000)
            );
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.logout}`)
                .set('Cookie', sessionCookie)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if no cookie passed', async () => {
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.logout}`)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('logout successfully and return an error trying to update tokens with the same refreshToken', async () => {
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.logout}`)
                .set('Cookie', sessionCookie)
                .expect(HTTP_STATUS_CODES.NO_CONTENT);
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.refreshToken}`)
                .set('Cookie', sessionCookie)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });
    });
});
