import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { UserCreateRequestModel } from '../types';
import { usersRepository } from '../repository';
import { createResponseError } from '../../../shared/helpers';
import { UserDBModel } from '../model';
import { add } from 'date-fns';

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
        const newUser: UserDBModel = {
            accountData: {
                login,
                email,
                passwordHash,
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), { hours: 1, minutes: 3 }),
                isConfirmed: false,
            },
            createdAt: new Date().toISOString(),
        };
        return await usersRepository.addNewUser(newUser);
    },

    async deleteUser(id: string) {
        const isDeleted = await usersRepository.deleteUser(new ObjectId(id));
        return isDeleted;
    },
};
function uuidv4(): string | null {
    throw new Error('Function not implemented.');
}
