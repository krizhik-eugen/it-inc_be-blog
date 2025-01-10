import { EmailManager } from '../../app/managers';
import { JwtService } from '../../app/services';
import { SessionsRepository } from '../security/repository';
import { UsersQueryRepository, UsersRepository } from '../users/repository';
import { AuthController } from './controller';
import { AuthService } from './service';

const jwtService = new JwtService();
const emailManager = new EmailManager();
const usersRepository = new UsersRepository();
const sessionsRepository = new SessionsRepository();
const usersQueryRepository = new UsersQueryRepository();

const authService = new AuthService(
    usersRepository,
    sessionsRepository,
    jwtService,
    emailManager
);

export const authController = new AuthController(
    usersQueryRepository,
    authService
);
