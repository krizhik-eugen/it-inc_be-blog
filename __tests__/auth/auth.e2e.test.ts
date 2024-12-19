import nodemailer from 'nodemailer';
import { baseRoutes } from '../../src/app/configs';
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
import { usersRepository } from '../../src/domain/users';
import { routersPaths } from '../../src/app/configs';

jest.mock('nodemailer');

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
        await usersRepository.clearUsers();
        await DBHandlers.closeDB();
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
                .send(loginCredentials);
            expect(response.status).toBe(HTTP_STATUS_CODES.OK);
            expect(response.body.accessToken).toBeDefined();
        });
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

        it('returns an error if no authentication provided', async () => {
            const response = await req.get(`${baseRoutes.auth}/me`);
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        });

        it('returns an error if token is not valid', async () => {
            const inValidToken = accessToken + '123';
            const response = await req
                .get(`${baseRoutes.auth}${routersPaths.auth.me}`)
                .auth(inValidToken, { type: 'bearer' });
            expect(response.status).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
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
    });

    describe('POST /registration-confirmation', () => {
        const newUser = getTestUser(113);

        let sendMailMock: jest.Mock;
        let createTransportMock: jest.Mock;

        let sentCode: string;

        beforeAll(async () => {
            sendMailMock = jest.fn((sendInfo) => {
                const regex = /code=([\w-]+)/;
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
                .post(`${baseRoutes.auth}${routersPaths.auth.registration}`)
                .send(newUser);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns an error if required code field is missing', async () => {
            const confirmCode = { code: '' };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.confirmation}`)
                .send(confirmCode)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('code');
        });

        it('returns an error if email is not valid', async () => {
            const confirmCode = { code: 'asdch iuys 23' };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.confirmation}`)
                .send(confirmCode)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('code');
        });

        it('confirms code successfully', async () => {
            const confirmCode = { code: sentCode };
            await req
                .post(`${baseRoutes.auth}${routersPaths.auth.confirmation}`)
                .send(confirmCode)
                .expect(HTTP_STATUS_CODES.NO_CONTENT);
        });

        it('returns an error if code is already confirmed ', async () => {
            const confirmCode = { code: sentCode };
            const response = await req
                .post(`${baseRoutes.auth}${routersPaths.auth.confirmation}`)
                .send(confirmCode)
                .expect(HTTP_STATUS_CODES.BAD_REQUEST);
            expect(response.body.errorsMessages[0].field).toEqual('code');
        });
    });
});
