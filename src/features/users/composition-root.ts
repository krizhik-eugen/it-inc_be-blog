import { UsersController } from './controller';
import { UsersQueryRepository, UsersRepository } from './repository';
import { UsersService } from './service';

export const usersQueryRepository = new UsersQueryRepository();
export const usersRepository = new UsersRepository();

export const usersService = new UsersService(usersRepository);

export const usersController = new UsersController(
    usersQueryRepository,
    usersService
);
