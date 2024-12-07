import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import { TAuthLoginRequest } from '../types';
import { authService } from '../service';

export const authController = {
    async login(req: TAuthLoginRequest, res: Response) {
        const result = await authService.login(req);
        if (typeof result !== 'boolean' && 'errorsMessages' in result) {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send(result);
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },
};
