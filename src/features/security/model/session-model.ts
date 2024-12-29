import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../../db';

export type SessionDBModel = OptionalUnlessRequiredId<{
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
    deviceName: string;
    ip: string;
}>;

// export type SessionDBSearchParams = {};

export const sessionsCollection = db.collection<SessionDBModel>('sessions');
