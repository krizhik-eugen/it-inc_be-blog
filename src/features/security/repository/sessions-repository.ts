import { sessionsCollection } from '../model';
import { SessionDBModel } from '../model/session-model';

export const sessionsRepository = {
    async getAllSessionDevices(userId: string) {
        return await sessionsCollection.find({ userId }).toArray();
    },

    async findSession(userId: string, deviceId: string) {
        return await sessionsCollection.findOne({ userId, deviceId });
    },

    async createSession({
        userId,
        deviceId,
        deviceName,
        exp,
        iat,
        ip,
    }: SessionDBModel) {
        await sessionsCollection.insertOne({
            userId,
            deviceId,
            deviceName,
            exp,
            iat,
            ip,
        });
    },

    async updateSession({
        userId,
        deviceId,
        iat,
        exp,
        ip,
    }: Partial<SessionDBModel>) {
        const result = await sessionsCollection.updateOne(
            { userId, deviceId },
            { $set: { iat, exp, ip } }
        );
        return result.modifiedCount > 0;
    },

    async revokeSession(userId: string, deviceId: string) {
        const result = await sessionsCollection.deleteOne({ userId, deviceId });
        return result.deletedCount > 0;
    },

    async revokeAllSessionsExceptCurrent(userId: string, deviceId: string) {
        const result = await sessionsCollection.deleteMany({
            userId,
            deviceId: { $ne: deviceId },
        });
        return result.deletedCount;
    },

    async clearSessions() {
        await sessionsCollection.deleteMany({});
    },
};
