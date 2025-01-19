import bcrypt from 'bcrypt';
import { UserCreateRequestModel } from '../api/types';
import { UsersRepository } from '../infrastructure/users-repository';
import {
    badRequestErrorResult,
    notFoundErrorResult,
    successResult,
} from '../../../shared/helpers';
import { UserModel } from '../domain/user-entity';
import { TResult } from '../../../shared/types';
import { inject, injectable } from 'inversify';
import { hashSaltRounds } from '../../../app/configs/app-config';

@injectable()
export class UsersService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository
    ) {}

    async createNewConfirmedUser({
        login,
        email,
        password,
    }: UserCreateRequestModel): Promise<
        TResult<{
            userId: string;
        }>
    > {
        const foundUserByLogin =
            await this.usersRepository.findUserByLoginOrEmail(login);
        const foundUserByEmail =
            await this.usersRepository.findUserByLoginOrEmail(email);

        if (foundUserByLogin || foundUserByEmail) {
            return badRequestErrorResult(
                'User with this login or email already exists'
            );
        }

        const passwordHash = await bcrypt.hash(password, hashSaltRounds);
        const newUser = UserModel.createNewConfirmedUser({
            login,
            email,
            passwordHash,
        });
        const savedUser = await this.usersRepository.save(newUser);

        return successResult({
            userId: savedUser.id,
        });
    }

    async deleteUser(id: string): Promise<TResult> {
        const isDeleted = await this.usersRepository.deleteUserById(id);
        if (!isDeleted) {
            return notFoundErrorResult('User is not found');
        }
        return successResult(null);
    }
}
