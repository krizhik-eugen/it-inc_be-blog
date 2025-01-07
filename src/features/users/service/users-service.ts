import bcrypt from 'bcrypt';
import { UserCreateRequestModel } from '../types';
import { UsersRepository } from '../repository';
import { createResponseError } from '../../../shared/helpers';
import { UserDBModel } from '../model';
import { TResult } from '../../../shared/types';

export class UsersService {
    constructor(protected usersRepository: UsersRepository) {}

    async createNewUser({
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
            return {
                status: 'BadRequest',
                errorsMessages: [
                    createResponseError(
                        'User with this login or email already exists'
                    ),
                ],
            };
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser: UserDBModel = {
            accountData: {
                login,
                email,
                passwordHash,
            },
            emailConfirmation: {
                confirmationCode: '',
                expirationDate: '',
                isConfirmed: 'Confirmed',
            },
            passwordRecovery: {
                recoveryCode: '',
                expirationDate: '',
            },
            createdAt: new Date().toISOString(),
        };
        const addedUserId = await this.usersRepository.addNewUser(newUser);
        if (!addedUserId) {
            return {
                status: 'InternalError',
                errorsMessages: [createResponseError('Error creating user')],
            };
        }
        return {
            status: 'Success',
            data: {
                userId: addedUserId,
            },
        };
    }

    async deleteUser(id: string): Promise<TResult> {
        const isDeleted = await this.usersRepository.deleteUser(id);
        if (!isDeleted) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('User is not found')],
            };
        }
        return {
            status: 'Success',
            data: null,
        };
    }
}
