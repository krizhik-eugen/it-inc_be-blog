import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { UserCreateRequestModel } from '../types';
import { usersRepository } from '../repository';
import { createResponseError } from '../../../shared/helpers';

export const usersService = {
    async createNewUser({ login, email, password }: UserCreateRequestModel) {
        const user = await usersRepository.findUserByLoginOrEmail(
            login || email
        );
        if (user) {
            return await Promise.resolve(
                createResponseError(
                    'User with this login or email already exists'
                )
            );
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = {
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
        };
        return await usersRepository.addNewUser(newUser);
    },

    async deleteUser(id: string) {
        const isDeleted = await usersRepository.deleteUser(new ObjectId(id));
        return isDeleted;
    },
};
