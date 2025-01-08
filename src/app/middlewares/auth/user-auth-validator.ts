import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { UsersRepository } from '../../../features/users';
import { JwtService } from '../../services';

const usersRepository = new UsersRepository();
const jwtService = new JwtService();

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
