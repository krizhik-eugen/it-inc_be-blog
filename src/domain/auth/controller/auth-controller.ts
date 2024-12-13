import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { TMeResponse, TAuthLoginRequest } from '../types';
import { authService } from '../service';
import { usersQueryRepository } from '../../../domain/users';

export const authController = {
    async login(req: TAuthLoginRequest, res: Response) {
        const { loginOrEmail, password } = req.body;
        const accessToken = await authService.login({ loginOrEmail, password });
        if (!accessToken) {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).send(accessToken);
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
};
