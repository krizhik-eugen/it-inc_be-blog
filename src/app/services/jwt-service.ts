import { injectable } from 'inversify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {
    accessTokenExpirationTime,
    jwtSecret,
    refreshTokenExpirationTime,
} from '../configs/app-config';

export type TJwtPayload = {
    userId: string;
    deviceId: string;
};

export type TDecodedToken = JwtPayload & TJwtPayload;

@injectable()
export class JwtService {
    generateAccessToken(userId: TJwtPayload['userId']) {
        return jwt.sign({ userId }, jwtSecret, {
            expiresIn: accessTokenExpirationTime,
        });
    }

    generateRefreshToken(
        userId: TJwtPayload['userId'],
        deviceId: TJwtPayload['deviceId']
    ) {
        return jwt.sign({ userId, deviceId }, jwtSecret, {
            expiresIn: refreshTokenExpirationTime,
        });
    }

    verifyToken(token: string) {
        try {
            return {
                error: null,
                data: jwt.verify(token, jwtSecret) as TDecodedToken,
            };
        } catch (e) {
            return {
                data: jwt.decode(token) as TDecodedToken,
                error:
                    e instanceof Error ? e.message : 'Token verification error',
            };
        }
    }

    decodeToken(token: string) {
        return jwt.decode(token) as TDecodedToken;
    }
}
