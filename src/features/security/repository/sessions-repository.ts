import { sessionsCollection } from '../model';
import { SessionDBModel } from '../model/session-model';

export const sessionsRepository = {
    async getAllSessionDevices(userId: string) {
        return await sessionsCollection.find({ userId }).toArray();
    },

    async findSession(deviceId: string) {
        return await sessionsCollection.findOne({ deviceId });
    },

    async createSession({
        userId,
        deviceId,
        deviceName,
        exp,
        iat,
        ip,
    }: SessionDBModel) {
        const result = await sessionsCollection.insertOne({
            userId,
            deviceId,
            deviceName,
            exp,
            iat,
            ip,
        });
        return result.insertedId.toString();
    },

    async updateSession({ deviceId, iat, exp, ip }: Partial<SessionDBModel>) {
        const result = await sessionsCollection.updateOne(
            { deviceId },
            { $set: { iat, exp, ip } }
        );
        return result.modifiedCount > 0;
    },

    async revokeSession(deviceId: string) {
        const result = await sessionsCollection.deleteOne({ deviceId });
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
