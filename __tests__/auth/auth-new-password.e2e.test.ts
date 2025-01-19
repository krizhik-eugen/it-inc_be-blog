import nodemailer from 'nodemailer';

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
import { rateLimiterMaxRequests } from '../../src/app/configs/app-config';

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

    describe('POST /new-password', () => {
        let sendMailMock: jest.Mock;
        let createTransportMock: jest.Mock;

        let sentCode: string;
        let sessionCookie: string;

        beforeAll(async () => {
            sendMailMock = jest.fn((sendInfo) => {
                const regex = /recoveryCode=([\w-]+)/;
                const match = sendInfo.html.match(regex);
                const code = match ? match[1] : null;
                sentCode = code;
                return Promise.resolve({});
            });
            createTransportMock = jest
                .fn()
                .mockReturnValue({ sendMail: sendMailMock });
            (nodemailer.createTransport as jest.Mock).mockImplementation(
                createTransportMock
            );

            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.passwordRecovery}`)
                .send({ email: testUser.email });
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('logins successfully with old credentials', async () => {
            const loginRequest = {
                loginOrEmail: testUser.login,
                password: testUser.password,
            };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginRequest)
                .expect(HTTP_STATUS_CODES.OK);
            sessionCookie = response.get('set-cookie') || '';

            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.logout}`)
                .set('Cookie', sessionCookie)
                .expect(HTTP_STATUS_CODES.NO_CONTENT);
        });

        it('returns an error if required code field is missing', async () => {
            const request = { recoveryCode: '', newPassword: 'newPassword' };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.newPassword}`)
                .send(request)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual(
                'recoveryCode'
            );
        });

        it('returns an error if required code is not correct', async () => {
            const request = {
                recoveryCode: sentCode + 'qwe123',
                newPassword: 'newPassword',
            };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.newPassword}`)
                .send(request)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual(
                'recoveryCode'
            );
        });

        it('returns an error if required newPassword field is missing', async () => {
            const request = { recoveryCode: sentCode, newPassword: '' };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.newPassword}`)
                .send(request)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual(
                'newPassword'
            );
        });

        it('confirms recovery code successfully and changes password', async () => {
            const request = {
                recoveryCode: sentCode,
                newPassword: 'newPassword',
            };
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.newPassword}`)
                .send(request)
                .expect(HTTP_STATUS_CODES.NO_CONTENT);
        });

        it('returns an error if rate limit is exceeded ', async () => {
            const request = {
                recoveryCode: 'rate_limit_test',
                newPassword: 'rate_limit_test',
            };
            let response;
            for (let i = 1; i <= rateLimiterMaxRequests + 1; i++) {
                response = await req
                    .post(`${baseRoutes.auth}${routersPaths.auth.newPassword}`)
                    .send(request);
            }
            expect(response?.status).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
        });

        it('can not login successfully with old credentials', async () => {
            const loginRequest = {
                loginOrEmail: testUser.login,
                password: testUser.password,
            };
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginRequest)
                .expect(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('logins successfully with new credentials', async () => {
            const loginRequest = {
                loginOrEmail: testUser.login,
                password: 'newPassword',
            };
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.login}`)
                .send(loginRequest)
                .expect(HTTP_STATUS_CODES.OK);
        });
    });
});
