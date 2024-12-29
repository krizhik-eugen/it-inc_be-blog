import { Router } from 'express';
import { securityController } from '../controller';
import { routersPaths } from '../../../app/configs';

export const securityRouter = Router();

securityRouter
    .route(routersPaths.security.devices)
    .get(securityController.getAllSessionDevices);

securityRouter
    .route(routersPaths.security.devices)
    .delete(securityController.terminateAllSessionsExceptCurrent);

securityRouter
    .route(routersPaths.security.devicesId)
    .delete(securityController.terminateDeviceSession);
