import { inject, injectable } from 'inversify';
import { Request } from 'express';
import { SessionService } from '../application/session-service';
import { TGetAllSessionDevicesResponse } from '../types';
import { HTTP_STATUS_CODES } from '../../../constants';
import { TResponseWithError } from '../../../shared/types';

@injectable()
export class SecurityController {
    constructor(
        @inject(SessionService) protected sessionService: SessionService
    ) {}

    async getAllSessionDevices(
        req: Request,
        res: TGetAllSessionDevicesResponse
    ) {
        const refreshToken = req.cookies.refreshToken;
        const result =
            await this.sessionService.getAllSessionDevices(refreshToken);
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(result.data);
    }

    async terminateAllSessionsExceptCurrent(
        req: Request,
        res: TResponseWithError
    ) {
        const refreshToken = req.cookies.refreshToken;
        const result =
            await this.sessionService.terminateAllSessionsExceptCurrent(
                refreshToken
            );
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }

    async terminateDeviceSession(req: Request, res: TResponseWithError) {
        const refreshToken = req.cookies.refreshToken;
        const deviceId = req.params.id;
        const result = await this.sessionService.terminateDeviceSession(
            refreshToken,
            deviceId
        );
        if (result.status === 'NotFound') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        if (result.status === 'Forbidden') {
            res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        if (result.status !== 'Success') {
            res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    }
}
