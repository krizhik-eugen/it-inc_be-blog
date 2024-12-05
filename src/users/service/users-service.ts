import bcrypt from "bcrypt";
import { ObjectId } from 'mongodb';
import { TCreateNewUserRequest, UserCreateRequestModel } from '../types';
import { usersRepository } from '../repository';
import { createResponseError } from '../../helpers';

export const usersService = {
    async createNewUser(req: TCreateNewUserRequest) {
        const { login, email, password } = req.body;
        const user = await usersRepository.findUserByLoginOrEmail({
            login,
            email,
        });
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

    async setUsers(users: UserCreateRequestModel[]) {
        const mappedUsers = await Promise.all(users.map(async (user) => {
            return {
                login: user.login,
                email: user.email,
                passwordHash: await bcrypt.hash(user.password, 10),
                createdAt: new Date().toISOString(),
            };
        }));
        await usersRepository.setUsers(mappedUsers);
    },
};
