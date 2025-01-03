import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { usersRepository } from '../../../features/users';
import { jwtService } from '../../services';

export const userAuthValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.headers.authorization) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
        return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const result = jwtService.verifyToken(token);
        if (result.error) {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
            return;
        }
        if (result.data.userId) {
            const user = await usersRepository.findUserById(result.data.userId);
            if (!user) {
                res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
                return;
            }
            req.userId = result.data.userId;
            next();
            return;
        }
    } catch {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
        return;
    }
};
