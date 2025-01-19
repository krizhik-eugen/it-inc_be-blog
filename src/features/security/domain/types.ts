import { HydratedDocument, Model } from 'mongoose';
import { sessionMethods, sessionStatics } from './session-entity';

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
type SessionMethods = typeof sessionMethods;

export type TSessionModel = Model<TSession, object, SessionMethods> &
    SessionStatics;

export type SessionDocument = HydratedDocument<TSession, SessionMethods>;
