import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
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
                confirmationCode: uuidv4(),
                expirationDate: null,
                isConfirmed: 'Confirmed',
            },
            createdAt: new Date().toISOString(),
            revokedRefreshTokens: [],
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
        const isDeleted = await usersRepository.deleteUser(new ObjectId(id));
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
