import { HydratedDocument, Model } from 'mongoose';
import { sessionStatics } from './session-entity';

export type TSession = {
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
    deviceName: string;
    ip: string;
};

export type TCreateSessionDTO = {
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
    deviceName: string;
    ip: string;
};

type SessionStatics = typeof sessionStatics;

export type TSessionModel = Model<TSession> & SessionStatics;

export type SessionDocument = HydratedDocument<TSession>;
