import jwt, { JwtPayload } from 'jsonwebtoken';
import {
    accessTokenExpirationTime,
    jwtSecret,
    refreshTokenExpirationTime,
} from '../../configs';

export const jwtService = {
    generateAccessToken(userId: string) {
        return jwt.sign({ userId }, jwtSecret, {
            expiresIn: accessTokenExpirationTime,
        });
    },

    generateRefreshToken(userId: string) {
        return jwt.sign({ userId }, jwtSecret, {
            expiresIn: refreshTokenExpirationTime,
        });
    },

    verifyToken(token: string) {
        return jwt.verify(token, jwtSecret) as JwtPayload & {
            userId: string;
        };
    },
};
