import bcrypt from 'bcrypt';
import { UserCreateRequestModel } from '../types';
import { usersRepository } from '../repository';
import { createResponseError } from '../../../shared/helpers';
import { UserDBModel } from '../model';
import { TResult } from '../../../shared/types';

export const usersService = {
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
            await usersRepository.findUserByLoginOrEmail(login);
        const foundUserByEmail =
            await usersRepository.findUserByLoginOrEmail(email);
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
        const addedUserId = await usersRepository.addNewUser(newUser);
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
    },

    async deleteUser(id: string): Promise<TResult> {
        const isDeleted = await usersRepository.deleteUser(id);
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
    },
};
