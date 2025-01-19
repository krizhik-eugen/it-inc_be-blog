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

    describe('POST /registration-email-resending', () => {
        const newUser = getTestUser(112);

        let sendMailMock: jest.Mock;
        let createTransportMock: jest.Mock;

        beforeAll(async () => {
            sendMailMock = jest.fn().mockResolvedValue({});
            createTransportMock = jest
                .fn()
                .mockReturnValue({ sendMail: sendMailMock });
            (nodemailer.createTransport as jest.Mock).mockImplementation(
                createTransportMock
            );

            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newUser);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns an error if required email field is missing', async () => {
            const resendEmail = { email: '' };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.resendEmail}`)
                .send(resendEmail)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('returns an error if email is not valid', async () => {
            const resendEmail = { email: invalidEmailFormat };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.resendEmail}`)
                .send(resendEmail)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('returns an error if email is to long', async () => {
            const resendEmail = { email: emailWithLengthGraterThan100 };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.resendEmail}`)
                .send(resendEmail)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('returns an error if email is already confirmed', async () => {
            const resendEmail = { email: testUser.email };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.resendEmail}`)
                .send(resendEmail)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('sends new email confirmation code', async () => {
            const resendEmail = { email: newUser.email };
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.resendEmail}`)
                .send(resendEmail)
                .expect(HTTP_STATUS_CODES.NO_CONTENT);
            expect(sendMailMock).toHaveBeenCalledTimes(1);
            expect(sendMailMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: newUser.email,
                    html: expect.stringContaining('code'),
                })
            );
        });

        it('returns an error if rate limit is exceeded ', async () => {
            const resendEmail = { email: testUser.email };
            let response;
            for (let i = 1; i <= rateLimiterMaxRequests + 1; i++) {
                response = await req
                    .post(`${baseRoutes.auth}${routersPaths.auth.resendEmail}`)
                    .send(resendEmail);
            }
            expect(response?.status).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
        });
    });
});
