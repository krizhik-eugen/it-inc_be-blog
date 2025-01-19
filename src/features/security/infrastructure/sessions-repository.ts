import { injectable } from 'inversify';
import { SessionModel } from '../domain/session-entity';
import { SessionDocument } from '../domain/types';

@injectable()
export class SessionsRepository {
    async findSessionByDeviceId(deviceId: string) {
        const result = await SessionModel.findOne({ deviceId });
        return result;
    }

    async save(session: SessionDocument) {
        return session.save();
    }

    async deleteSessionByDeviceId(deviceId: string) {
        const result = await SessionModel.deleteOne({
            deviceId,
        });
        return result.deletedCount || 0;
    }

    async deleteAllSessionsExceptCurrent(userId: string, deviceId: string) {
        const result = await SessionModel.deleteMany({
            userId,
            deviceId: { $ne: deviceId },
        });
        return result.deletedCount || 0;
    }

    async deleteAllSessions() {
        const result = await SessionModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
