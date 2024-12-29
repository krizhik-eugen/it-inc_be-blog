import jwt from 'jsonwebtoken';
import {
    accessTokenExpirationTime,
    jwtSecret,
    refreshTokenExpirationTime,
} from '../../configs';
import { TDecodedToken, TJwtPayload } from './types';

export const jwtService = {
    generateAccessToken(userId: TJwtPayload['userId']) {
        return jwt.sign({ userId }, jwtSecret, {
            expiresIn: accessTokenExpirationTime,
        });
    },

    generateRefreshToken(
        userId: TJwtPayload['userId'],
        deviceId: TJwtPayload['deviceId']
    ) {
        return jwt.sign({ userId, deviceId }, jwtSecret, {
            expiresIn: refreshTokenExpirationTime,
        });
    },

    verifyToken(token: string) {
        return jwt.verify(token, jwtSecret) as TDecodedToken;
    },

    decodeToken(token: string) {
        return jwt.decode(token) as TDecodedToken;
    },
};
