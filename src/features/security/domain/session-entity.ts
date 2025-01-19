import { model, Schema } from 'mongoose';
import { TCreateSessionDTO, TSession, TSessionModel } from './types';

const sessionSchema = new Schema<TSession>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    iat: { type: Number, required: true },
    exp: { type: Number, required: true },
    deviceName: { type: String, required: true, default: 'Unknown device' },
    ip: { type: String, required: true },
});

export const sessionStatics = {
    createSession(dto: TCreateSessionDTO) {
        const newSession = new SessionModel(dto);
        return newSession;
    },
};

sessionSchema.statics = sessionStatics;

export const SessionModel = model<TSession, TSessionModel>(
    'sessions',
    sessionSchema
);
