import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { UsersRepository } from '../../../features/users/repository';
import { JwtService } from '../../services';

const usersRepository = new UsersRepository();
const jwtService = new JwtService();

export const userAuthIdentifier = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    req.userId = null;
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const result = jwtService.verifyToken(token);
        if (result.data.userId) {
            const user = await usersRepository.findUserById(result.data.userId);
            if (!user) {
                next();
                return;
            }
            req.userId = result.data.userId;
        }
    }
    next();
    return;
};
