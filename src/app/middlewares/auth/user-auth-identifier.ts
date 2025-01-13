import { Request, Response, NextFunction } from 'express';
import { container } from '../../../app-composition-root';
import { JwtService } from '../../services';
import { UsersRepository } from '../../../features/users/repository';

const jwtService = container.get(JwtService);
const usersRepository = container.get(UsersRepository);

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
