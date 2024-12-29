import { JwtPayload } from 'jsonwebtoken';

export type TJwtPayload = {
    userId: string;
    deviceId: string;
};

export type TDecodedToken = JwtPayload & TJwtPayload;
