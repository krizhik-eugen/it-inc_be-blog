import { emailManager, jwtService } from '../../app/app-composition-root';
import { sessionsRepository } from '../security';
import { usersQueryRepository, usersRepository } from '../users';
import { AuthController } from './controller';
import { AuthService } from './service';

export const authService = new AuthService(
    usersRepository,
    sessionsRepository,
    jwtService,
    emailManager
);

export const authController = new AuthController(
    usersQueryRepository,
    authService
);
