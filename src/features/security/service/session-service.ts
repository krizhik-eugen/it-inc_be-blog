import { SessionsQueryRepository, SessionsRepository } from '../repository';
import { SessionViewModel } from '../types';
import { TResult } from '../../../shared/types';
import { AuthService } from '../../auth';
import {
    createResponseError,
    forbiddenErrorResult,
    notFoundErrorResult,
    successResult,
} from '../../../shared/helpers';

export class SessionService {
    constructor(
        protected sessionsQueryRepository: SessionsQueryRepository,
        protected sessionsRepository: SessionsRepository,
        protected authService: AuthService
    ) {}

    async getAllSessionDevices(
        refreshToken: string
    ): Promise<TResult<SessionViewModel[]>> {
        const validationResult =
            await this.authService.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        const sessions =
            await this.sessionsQueryRepository.getAllSessionDevices(
                validationResult.data.userId
            );
        return successResult(sessions!);
    }

    async terminateAllSessionsExceptCurrent(
        refreshToken: string
    ): Promise<TResult> {
        const validationResult =
            await this.authService.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        await this.sessionsRepository.revokeAllSessionsExceptCurrent(
            validationResult.data.userId,
            validationResult.data.deviceId
        );
        return successResult(null);
    }

    async terminateDeviceSession(
        refreshToken: string,
        deviceId: string
    ): Promise<TResult> {
        const validationResult =
            await this.authService.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        const session = await this.sessionsRepository.findSession(deviceId);
        if (!session) {
            return notFoundErrorResult('Session is not found');
        }
        if (session.userId !== validationResult.data.userId) {
            return forbiddenErrorResult('You are not an owner');
        }
        await this.sessionsRepository.revokeSession(deviceId);
        return successResult(null);
    }
}
