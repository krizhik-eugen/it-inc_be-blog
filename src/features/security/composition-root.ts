import { EmailManager } from '../../app/managers';
import { JwtService } from '../../app/services';
import { AuthService } from '../auth/service';
import { UsersRepository } from '../users/repository';
import { SecurityController } from './controller';
import { SessionsQueryRepository, SessionsRepository } from './repository';
import { SessionService } from './service';

const sessionsQueryRepository = new SessionsQueryRepository();
const sessionsRepository = new SessionsRepository();
const jwtService = new JwtService();
const emailManager = new EmailManager();
const usersRepository = new UsersRepository();

const authService = new AuthService(
    usersRepository,
    sessionsRepository,
    jwtService,
    emailManager
);

export const sessionService = new SessionService(
    sessionsQueryRepository,
    sessionsRepository,
    authService
);

export const securityController = new SecurityController(sessionService);
