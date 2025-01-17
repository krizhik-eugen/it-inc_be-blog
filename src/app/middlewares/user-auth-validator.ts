import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../constants';
import { container } from '../../app-composition-root';
import { JwtService } from '../services/jwt-service';
import { UsersRepository } from '../../features/users/infrastructure/users-repository';

const jwtService = container.get(JwtService);
const usersRepository = container.get(UsersRepository);

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
};
