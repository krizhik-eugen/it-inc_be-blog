import { sessionsQueryRepository, sessionsRepository } from '../repository';
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
        const sessions = await sessionsQueryRepository.getAllSessionDevices(
            validationResult.data.userId
        );
        return {
            status: 'Success',
            data: sessions!,
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
        const session = await sessionsRepository.findSession(deviceId);
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
        await sessionsRepository.revokeSession(deviceId);
        return {
            status: 'Success',
            data: null,
        };
    },
};
