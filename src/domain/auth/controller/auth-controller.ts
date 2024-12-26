import { Request } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import {
    TLoginRequest,
    TRegisterRequest,
    TConfirmationRequest,
    TResendRegistrationEmailRequest,
    TLoginResponse,
    TRegisterResponse,
    TMeResponse,
    TConfirmationResponse,
    TResendRegistrationEmailResponse,
} from '../types';
import { authService } from '../service';
import { usersQueryRepository } from '../../../domain/users';

export const authController = {
    async login(req: TLoginRequest, res: TLoginResponse) {
        const { loginOrEmail, password } = req.body;
        const result = await authService.login({ loginOrEmail, password });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.cookie('refreshToken', result.data.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(HTTP_STATUS_CODES.OK).json({
            accessToken: result.data.accessToken,
        });
    },

    async me(req: Request, res: TMeResponse) {
        const userId = req.userId!;
        const user = await usersQueryRepository.getUser(userId);
        res.status(HTTP_STATUS_CODES.OK).json({
            userId: user!.id,
            login: user!.login,
            email: user!.email,
        });
    },

    async register(req: TRegisterRequest, res: TRegisterResponse) {
        const { login, email, password } = req.body;
        const result = await authService.createUser({ login, email, password });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async confirmRegistration(
        req: TConfirmationRequest,
        res: TConfirmationResponse
    ) {
        const { code } = req.body;
        const result = await authService.confirmEmail(code);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async resendRegistrationEmail(
        req: TResendRegistrationEmailRequest,
        res: TResendRegistrationEmailResponse
    ) {
        const { email } = req.body;
        const result = await authService.resendConfirmationCode(email);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async generateNewTokens(req: Request, res: TLoginResponse) {
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.generateNewTokens(refreshToken);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.cookie('refreshToken', result.data.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        res.status(HTTP_STATUS_CODES.OK).json({
            accessToken: result.data.accessToken,
        });
    },

    async logout(req: Request, res: TLoginResponse) {
        const refreshToken = req.cookies.refreshToken;
        const result = await authService.logout(refreshToken);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.clearCookie('refreshToken');
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },
};
