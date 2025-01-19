import nodemailer from 'nodemailer';

import {
    addNewUser,
    DBHandlers,
    req,
    getTestUser,
    invalidEmailFormat,
    emailWithLengthGraterThan100,
    clearAllCollections,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { RateLimiterModel } from '../../src/app/models/rate-limiter-model';
import { baseRoutes, routersPaths } from '../../src/app/configs/routes-config';
import { rateLimiterMaxRequests } from '../../src/app/configs/app-config';

jest.mock('nodemailer');

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

    describe('POST /password-recovery', () => {
        let sendMailMock: jest.Mock;
        let createTransportMock: jest.Mock;

        beforeAll(() => {
            sendMailMock = jest.fn().mockResolvedValue({});
            createTransportMock = jest
                .fn()
                .mockReturnValue({ sendMail: sendMailMock });
            (nodemailer.createTransport as jest.Mock).mockImplementation(
                createTransportMock
            );
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns an error if required email field is missing', async () => {
            const request = { email: '' };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.passwordRecovery}`)
                .send(request)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('returns an error if required email field is not valid', async () => {
            const request = { email: invalidEmailFormat };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.passwordRecovery}`)
                .send(request)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('returns an error if required email field is to long', async () => {
            const request = { email: emailWithLengthGraterThan100 };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.passwordRecovery}`)
                .send(request)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('returns success even if provided email is not registered', async () => {
            const request = { email: 'notexisting@example.com' };
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.passwordRecovery}`)
                .send(request)
                .expect(HTTP_STATUS_CODES.NO_CONTENT);
        });

        it('sends email password recovery code', async () => {
            const request = { email: testUser.email };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.passwordRecovery}`)
                .send(request);
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            expect(response.body).toEqual({});
            expect(sendMailMock).toHaveBeenCalledTimes(1);
            expect(sendMailMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: testUser.email,
                    html: expect.stringContaining('recoveryCode'),
                })
            );
        });

        it('returns an error if rate limit is exceeded ', async () => {
            const request = { email: 'ratelimitertest@example.com' };
            let response;
            for (let i = 1; i <= rateLimiterMaxRequests + 1; i++) {
                response = await req
                    .post(
                        `${baseRoutes.auth}${routersPaths.auth.passwordRecovery}`
                    )
                    .send(request);
            }
            expect(response?.status).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
        });
    });
});
