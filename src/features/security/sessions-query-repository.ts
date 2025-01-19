import { injectable } from 'inversify';
import { SessionViewModel } from './types';
import { SessionsModel } from './session-model';

@injectable()
export class SessionsQueryRepository {
    async getAllSessionDevices(
        userId: string
    ): Promise<SessionViewModel[] | null> {
        const result = await SessionsModel.find({ userId }).lean();
        const mappedResult = result.map((session) => ({
            deviceId: session.deviceId,
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: new Date(session.iat * 1000).toISOString(),
        }));
        return mappedResult;
    }
}
