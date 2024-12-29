import { sessionsRepository } from '../repository';
import { SessionViewModel } from '../types';
import { TResult } from '../../../shared/types';
import { authService } from '../../auth';

export const sessionService = {
    async getAllSessionDevices(
        refreshToken: string
    ): Promise<TResult<SessionViewModel[]>> {
        const validationResult =
            await authService.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        const sessions = await sessionsRepository.getAllSessionDevices(
            validationResult.data.userId
        );
        const mappedSessions = sessions.map((session) => ({
            deviceId: session.deviceId,
            ip: session.ip,
            title: session.deviceName,
            lastActiveDate: session.iat,
        }));
        return {
            status: 'Success',
            data: mappedSessions,
        };
    },

    async terminateAllSessionsExceptCurrent(
        refreshToken: string
    ): Promise<TResult> {
        const validationResult =
            await authService.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        await sessionsRepository.revokeAllSessionsExceptCurrent(
            validationResult.data.userId,
            validationResult.data.deviceId
        );
        return {
            status: 'Success',
            data: null,
        };
    },

    async terminateDeviceSession(
        refreshToken: string,
        deviceId: string
    ): Promise<TResult> {
        const validationResult =
            await authService.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        await sessionsRepository.revokeAllSessionsExceptCurrent(
            validationResult.data.userId,
            deviceId
        );
        return {
            status: 'Success',
            data: null,
        };
    },
};
