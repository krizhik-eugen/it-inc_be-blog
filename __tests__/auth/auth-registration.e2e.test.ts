import nodemailer from 'nodemailer';
import { baseRoutes, rateLimiterMaxRequests } from '../../src/app/configs';
import {
    addNewUser,
    DBHandlers,
    req,
    getTestUser,
    textWithLengthGraterThan20,
    textWithLengthGraterThan10,
    invalidEmailFormat,
    emailWithLengthGraterThan100,
} from '../test-helpers';
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

    describe('POST /registration', () => {
        const newUser = getTestUser(111);

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

        it('returns an error if required fields are missing', async () => {
            const newWrongUser = { ...newUser };
            for (const key of Object.keys(
                newWrongUser
            ) as (keyof typeof newWrongUser)[]) {
                const loginUser = { ...newWrongUser };
                delete loginUser[key];
                const response = await req
                    .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                    .send(loginUser)
                    .expect(HTTP_STATUS_CODES.BAD_REQUEST);
                expect(response.body.errorsMessages[0].field).toEqual(key);
            }
        });

        it('returns an error if required password field is to short', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.password = '';
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('password');
        });

        it('returns an error if required password field is to long', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.password = textWithLengthGraterThan20;
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('password');
        });

        it('returns an error if required login field is to short', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.login = 'qw';
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('login');
        });

        it('returns an error if required login field is to long', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.login = textWithLengthGraterThan10;
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('login');
        });

        it('returns an error if required email field is not valid', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.email = invalidEmailFormat;
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('returns an error if required email field is to long', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.email = emailWithLengthGraterThan100;
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('email');
        });

        it('returns an error if provided email already registered', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.email = testUser.email;
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].message).toEqual(
                'User with this login or email already exists'
            );
        });

        it('returns an error if provided login already registered', async () => {
            const newWrongUser = { ...newUser };
            newWrongUser.login = testUser.login;
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newWrongUser)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].message).toEqual(
                'User with this login or email already exists'
            );
        });

        it('creates a new user and send email confirmation code', async () => {
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newUser);
            expect(response.status).toBe(HTTP_STATUS_CODES.NO_CONTENT);
            expect(response.body).toEqual({});
            expect(sendMailMock).toHaveBeenCalledTimes(1);
            expect(sendMailMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: newUser.email,
                    html: expect.stringContaining('code'),
                })
            );
        });

        it('returns an error if rate limit is exceeded ', async () => {
            const newWrongUser = { ...newUser };
            let response;
            for (let i = 1; i <= rateLimiterMaxRequests + 1; i++) {
                response = await req
                    .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                    .send(newWrongUser);
            }
            expect(response?.status).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
        });
    });
});
