import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import {
    TMeResponse,
    TLoginRequest,
    TRegisterRequest,
    TConfirmationRequest,
    TRegisterResponse,
    TResendRegistrationEmailRequest,
} from '../types';
import { authService } from '../service';
import { usersQueryRepository } from '../../../domain/users';

export const authController = {
    async login(req: TLoginRequest, res: Response) {
        const { loginOrEmail, password } = req.body;
        const result = await authService.login({ loginOrEmail, password });
        if (result.status !== 'Success') {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).send(result.data);
    },

    async me(req: Request, res: TMeResponse) {
        const userId = req.userId!;
        const user = await usersQueryRepository.getUser(userId);
        res.status(HTTP_STATUS_CODES.OK).send({
            userId: user!.id,
            login: user!.login,
            email: user!.email,
        });
    },

    async register(req: TRegisterRequest, res: TRegisterResponse) {
        const { login, email, password } = req.body;
        const result = await authService.createUser({ login, email, password });
        if (result.extensions.length > 0) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                errorsMessages: result.extensions,
            });
            return;
        }

        if (!result) {
            res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async confirmRegistration(req: TConfirmationRequest, res: Response) {
        const { code } = req.body;
        const result = await authService.confirmEmail(code);
        if (result.status !== 'Success') {
            res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async resendRegistrationEmail(
        req: TResendRegistrationEmailRequest,
        res: Response
    ) {
        const { email } = req.body;
        const result = await authService.resendConfirmationCode(email);
        if (result.status !== 'Success') {
            res.sendStatus(HTTP_STATUS_CODES.BAD_REQUEST);
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },
};
