import { Router } from 'express';
import { container } from '../../app-composition-root';
import { SecurityController } from './security-controller';
import { routersPaths } from '../../app/configs/routes-config';

export const securityRouter = Router();

const securityController = container.get(SecurityController);

securityRouter
    .route(routersPaths.security.devices)
    .get(securityController.getAllSessionDevices.bind(securityController));

securityRouter
    .route(routersPaths.security.devices)
    .delete(
        securityController.terminateAllSessionsExceptCurrent.bind(
            securityController
        )
    );

securityRouter
    .route(routersPaths.security.devicesId)
    .delete(securityController.terminateDeviceSession.bind(securityController));
