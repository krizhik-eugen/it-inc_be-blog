import { UsersController } from './controller';
import { UsersQueryRepository, UsersRepository } from './repository';
import { UsersService } from './service';

const usersQueryRepository = new UsersQueryRepository();
const usersRepository = new UsersRepository();

const usersService = new UsersService(usersRepository);

export const usersController = new UsersController(
    usersQueryRepository,
    usersService
);
