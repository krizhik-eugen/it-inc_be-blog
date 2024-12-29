import { sessionsRepository } from '../repository';
import { SessionViewModel } from '../types';
import { TResult } from '../../../shared/types';
import { authService } from '../../auth';
import { createResponseError } from '../../../shared/helpers';

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
            lastActiveDate: new Date(session.iat * 1000).toISOString(),
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
        const session = await sessionsRepository.findSession(
            validationResult.data.userId,
            deviceId
        );
        if (!session) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('Session is not found')],
            };
        }
        if (session.userId !== validationResult.data.userId) {
            return {
                status: 'Forbidden',
                errorsMessages: [createResponseError('You are not an owner')],
            };
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
