import { SecurityController } from './controller';
import { SessionsQueryRepository, SessionsRepository } from './repository';
import { SessionService } from './service';

export const sessionsQueryRepository = new SessionsQueryRepository();
export const sessionsRepository = new SessionsRepository();

export const sessionService = new SessionService(
    sessionsQueryRepository,
    sessionsRepository
);

export const securityController = new SecurityController(sessionService);
