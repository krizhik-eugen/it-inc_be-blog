import { injectable } from 'inversify';
import { SessionViewModel } from '../api/types';
import { SessionModel } from '../domain/session-entity';

@injectable()
export class SessionsQueryRepository {
    async getAllSessionDevices(
        userId: string
    ): Promise<SessionViewModel[] | null> {
        const result = await SessionModel.find({ userId }).lean();
        const mappedResult = result.map((session) => ({
            deviceId: session.deviceId,
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: new Date(session.iat * 1000).toISOString(),
        }));
        return mappedResult;
    }
}
