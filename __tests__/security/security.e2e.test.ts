import {
    addNewUser,
    DBHandlers,
    req,
    getTestUser,
    mockUserAgents,
    clearAllCollections,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { baseRoutes, routersPaths } from '../../src/app/configs/routes-config';
import { RateLimiterModel } from '../../src/app/models/rate-limiter-model';
import { refreshTokenExpirationTime } from '../../src/app/configs/app-config';
import { SessionModel } from '../../src/features/security/domain/session-entity';

jest.mock('nodemailer');
jest.mock('../../src/app/configs/app-config', () => ({
    ...jest.requireActual('../../src/app/configs/app-config'),
    accessTokenExpirationTime: 2,
    refreshTokenExpirationTime: 4,
}));

describe('Security Controller', () => {
    const testUser1 = getTestUser(1);
    const testUser2 = getTestUser(2);
    const loginCredentials1 = {
        loginOrEmail: testUser1.login,
        password: testUser1.password,
    };
    const loginCredentials2 = {
        loginOrEmail: testUser2.login,
        password: testUser2.password,
    };

    const loginAllDevices = async () => {
        const response1 = await req
            .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
            .send(loginCredentials1)
            .set('user-agent', mockUserAgents.chromeAndroid);
        const sessionCookie1 = response1.get('set-cookie') || '';
        const response2 = await req
            .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
            .send(loginCredentials1)
            .set('user-agent', mockUserAgents.safariMacOS);
        const sessionCookie2 = response2.get('set-cookie') || '';
        const response3 = await req
            .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
            .send(loginCredentials1)
            .set('user-agent', mockUserAgents.chromeWindows);
        const sessionCookie3 = response3.get('set-cookie') || '';
        const response4 = await req
            .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
            .send(loginCredentials2)
            .set('user-agent', mockUserAgents.firefoxLinux);
        const sessionCookie4 = response4.get('set-cookie') || '';
        return {
            sessionCookie1,
            sessionCookie2,
            sessionCookie3,
            sessionCookie4,
        };
    };

    beforeAll(async () => {
        await DBHandlers.connectToDB();
        await addNewUser(testUser1);
        await addNewUser(testUser2);
    });

    afterAll(async () => {
        await clearAllCollections();
        await DBHandlers.closeDB();
    });

    describe('GET /devices', () => {
        let sessionCookie1: string;
        let sessionCookie2: string;
        let sessionCookie3: string;
        let sessionCookie4: string;

        beforeAll(async () => {
            const cookies = await loginAllDevices();
            sessionCookie1 = cookies.sessionCookie1;
            sessionCookie2 = cookies.sessionCookie2;
            sessionCookie3 = cookies.sessionCookie3;
            sessionCookie4 = cookies.sessionCookie4;
        });

        afterAll(async () => {
            await RateLimiterModel.deleteMany({});
            await SessionModel.deleteMany({});
            await new Promise((resolve) =>
                setTimeout(resolve, refreshTokenExpirationTime * 1000)
            );
        });

        it('returns all sessions by user', async () => {
            const response1 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie1)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response1.body.length).toBe(3);
            const response2 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie2)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response2.body.length).toBe(3);
            const response3 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie3)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response3.body.length).toBe(3);
            const response4 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie4)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response4.body.length).toBe(1);

            const updateTokenResponse = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.refreshToken}`)
                .send(loginCredentials1)
                .set('user-agent', mockUserAgents.chromeAndroid)
                .set('Cookie', sessionCookie1);

            const newSessionCookie1 =
                updateTokenResponse.get('set-cookie') || '';

            const response5 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', newSessionCookie1)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response5.body.length).toBe(3);
        });

        it('returns an error if session cookie is invalid', async () => {
            await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie1 + '123')
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if token is expired', async () => {
            await new Promise((resolve) =>
                setTimeout(resolve, refreshTokenExpirationTime * 1000)
            );
            await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', 'qw123' + sessionCookie1)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });
    });

    describe('DELETE /devices', () => {
        let sessionCookie1: string;

        beforeAll(async () => {
            const cookies = await loginAllDevices();
            sessionCookie1 = cookies.sessionCookie1;
        });

        afterAll(async () => {
            await RateLimiterModel.deleteMany({});
            await SessionModel.deleteMany({});
            await new Promise((resolve) =>
                setTimeout(resolve, refreshTokenExpirationTime * 1000)
            );
        });

        it('returns an error if session cookie is invalid', async () => {
            await req
                .delete(
                    `${baseRoutes.security}${routersPaths.security.devices}`
                )
                .set('Cookie', 'qw123' + sessionCookie1)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('terminate all session except current', async () => {
            const response1 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie1)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response1.body.length).toBe(3);

            await req
                .delete(
                    `${baseRoutes.security}${routersPaths.security.devices}`
                )
                .set('Cookie', sessionCookie1)
                .expect(HTTP_STATUS_CODES.NO_CONTENT);

            const response2 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie1)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response2.body.length).toBe(1);
        });

        it('returns an error if token is expired', async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, refreshTokenExpirationTime * 1000);
            });
            await req
                .delete(
                    `${baseRoutes.security}${routersPaths.security.devices}`
                )
                .set('Cookie', sessionCookie1)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });
    });

    describe('DELETE /devices/:id', () => {
        let sessionCookie1: string;
        let sessionCookie2: string;
        let sessionCookie4: string;
        let deviceId1: string;
        let deviceId2: string;

        beforeAll(async () => {
            const cookies = await loginAllDevices();
            sessionCookie1 = cookies.sessionCookie1;
            sessionCookie2 = cookies.sessionCookie2;
            sessionCookie4 = cookies.sessionCookie4;

            const response1 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie1);
            deviceId1 = response1.body[0].deviceId;
            const response2 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie4);
            deviceId2 = response2.body[0].deviceId;
        });

        afterAll(async () => {
            await RateLimiterModel.deleteMany({});
            await SessionModel.deleteMany({});
            await new Promise((resolve) =>
                setTimeout(resolve, refreshTokenExpirationTime * 1000)
            );
        });

        it('returns an error if session cookie is invalid', async () => {
            await req
                .delete(
                    `${baseRoutes.security}${routersPaths.security.devices}/${deviceId1}`
                )
                .set('Cookie', 'qw123' + sessionCookie1)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if not an owner of session', async () => {
            await req
                .delete(
                    `${baseRoutes.security}${routersPaths.security.devices}/${deviceId2}`
                )
                .set('Cookie', sessionCookie1)
                .expect(HTTP_STATUS_CODES.FORBIDDEN);
        });

        it('terminate session by id', async () => {
            const response1 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie1);
            expect(response1.body.length).toBe(3);

            await req
                .delete(
                    `${baseRoutes.security}${routersPaths.security.devices}/${deviceId1}`
                )
                .set('Cookie', sessionCookie1)
                .expect(HTTP_STATUS_CODES.NO_CONTENT);

            await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie1)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);

            const response3 = await req
                .get(`${baseRoutes.security}${routersPaths.security.devices}`)
                .set('Cookie', sessionCookie2)
                .expect(HTTP_STATUS_CODES.OK);
            expect(response3.body.length).toBe(2);
        });

        it('returns an error if token is expired', async () => {
            await new Promise((resolve) => {
                setTimeout(resolve, refreshTokenExpirationTime * 1000);
            });
            await req
                .delete(
                    `${baseRoutes.security}${routersPaths.security.devices}/${deviceId2}`
                )
                .set('Cookie', sessionCookie4)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });
    });
});
