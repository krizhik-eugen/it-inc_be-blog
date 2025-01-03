import { model, Schema } from 'mongoose';

export interface SessionDBModel {
    userId: string;
    deviceId: string;
    iat: number;
    exp: number;
    deviceName: string;
    ip: string;
}

const sessionsSchema = new Schema<SessionDBModel>({
    userId: String,
    deviceId: String,
    iat: Number,
    exp: Number,
    deviceName: String,
    ip: String,
});

export const SessionsModel = model('sessions', sessionsSchema);
