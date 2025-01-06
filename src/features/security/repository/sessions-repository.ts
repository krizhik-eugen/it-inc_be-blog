import { SessionsModel } from '../model';
import { SessionDBModel } from '../model/session-model';

export const sessionsRepository = {
    async findSession(deviceId: string) {
        const result = await SessionsModel.findOne({ deviceId });
        return result;
    },

    async createSession({
        userId,
        deviceId,
        deviceName,
        exp,
        iat,
        ip,
    }: SessionDBModel) {
        const result = await SessionsModel.create({
            userId,
            deviceId,
            deviceName,
            exp,
            iat,
            ip,
        });
        return result.id;
    },

    async updateSession({ deviceId, iat, exp, ip }: Partial<SessionDBModel>) {
        const result = await SessionsModel.findOneAndUpdate(
            { deviceId },
            {
                iat,
                exp,
                ip,
            }
        ).lean();
        return result;
    },

    async revokeSession(deviceId: string) {
        const result = await SessionsModel.findOneAndDelete({
            deviceId,
        }).lean();
        return result;
    },

    async revokeAllSessionsExceptCurrent(userId: string, deviceId: string) {
        const result = await SessionsModel.deleteMany({
            userId,
            deviceId: { $ne: deviceId },
        });
        return result.deletedCount || 0;
    },

    async clearSessions() {
        const result = await SessionsModel.deleteMany({});
        return result.deletedCount || 0;
    },
};
