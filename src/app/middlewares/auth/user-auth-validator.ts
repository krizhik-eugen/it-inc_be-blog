import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { jwtSecret } from '../../configs';
import { ObjectId } from 'mongodb';
import { usersRepository } from '../../../users';

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
        const result = jwt.verify(token, jwtSecret) as JwtPayload & {
            userId: string;
        };
        if (result.userId) {
            const user = await usersRepository.findUserById(
                new ObjectId(result.userId)
            );
            if (!user) {
                res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
                return;
            }
            req.userId = result.userId;
            next();
            return;
        }
    } catch {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
        return;
    }
    res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED);
};
