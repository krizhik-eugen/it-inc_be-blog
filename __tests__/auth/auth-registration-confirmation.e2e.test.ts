import nodemailer from 'nodemailer';
import { baseRoutes, rateLimiterMaxRequests } from '../../src/app/configs';
import {
    addNewUser,
    DBHandlers,
    req,
    getTestUser,
    clearAllCollections,
} from '../test-helpers';
import { HTTP_STATUS_CODES } from '../../src/constants';
import { routersPaths } from '../../src/app/configs';
import { RateLimiterModel } from '../../src/app/models/rate-limiter';

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
        await clearAllCollections();
        await DBHandlers.closeDB();
    });

    afterEach(async () => {
        await RateLimiterModel.deleteMany({});
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

        it('returns an error if rate limit is exceeded ', async () => {
            const confirmCode = { code: sentCode };
            let response;
            for (let i = 1; i <= rateLimiterMaxRequests + 1; i++) {
                response = await req
                    .post(`${baseRoutes.auth}${routersPaths.auth.confirmation}`)
                    .send(confirmCode);
            }
            expect(response?.status).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
        });
    });
});
