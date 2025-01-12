import { Request } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import {
    TLoginRequest,
    TRegisterRequest,
    TConfirmationRequest,
    TResendRegistrationEmailRequest,
    TLoginResponse,
    TMeResponse,
    TPasswordRecoveryRequest,
    TNewPasswordRequest,
} from '../types';
import { AuthService } from '../service';
import { getDeviceTitle } from '../../../shared/helpers';
import { TResponseWithError } from '../../../shared/types';
import { UsersQueryRepository } from '../../users/repository';

export class AuthController {
    constructor(
        protected usersQueryRepository: UsersQueryRepository,
        protected authService: AuthService
    ) {}

    async login(req: TLoginRequest, res: TLoginResponse) {
        const { loginOrEmail, password } = req.body;
        const ip = req.ip!;
        const deviceTitle = getDeviceTitle(req.headers['user-agent']);
        const result = await this.authService.login(
            { loginOrEmail, password },
            deviceTitle,
            ip
        );
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
    }

    async me(req: Request, res: TMeResponse) {
        const userId = req.userId!;
        const user = await this.usersQueryRepository.getUser(userId);
        res.status(HTTP_STATUS_CODES.OK).json({
            userId: user!.id,
            login: user!.login,
            email: user!.email,
        });
    }

    async register(req: TRegisterRequest, res: TResponseWithError) {
        const { login, email, password } = req.body;
        const result = await this.authService.createUser({
            login,
            email,
            password,
        });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async confirmRegistration(
        req: TConfirmationRequest,
        res: TResponseWithError
    ) {
        const { code } = req.body;
        const result = await this.authService.confirmEmail(code);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async resendRegistrationEmail(
        req: TResendRegistrationEmailRequest,
        res: TResponseWithError
    ) {
        const { email } = req.body;
        const result = await this.authService.resendConfirmationCode(email);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async passwordRecovery(
        req: TPasswordRecoveryRequest,
        res: TResponseWithError
    ) {
        const { email } = req.body;
        const result = await this.authService.passwordRecovery({ email });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async newPassword(req: TNewPasswordRequest, res: TResponseWithError) {
        const { newPassword, recoveryCode } = req.body;
        const result = await this.authService.newPassword({
            newPassword,
            recoveryCode,
        });
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async createNewSession(req: Request, res: TLoginResponse) {
        const refreshToken = req.cookies.refreshToken;
        const ip = req.ip!;
        const result = await this.authService.createNewSession(
            refreshToken,
            ip
        );
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
    }

    async logout(req: Request, res: TLoginResponse) {
        const refreshToken = req.cookies.refreshToken;
        const result = await this.authService.logout(refreshToken);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.clearCookie('refreshToken');
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }
}
