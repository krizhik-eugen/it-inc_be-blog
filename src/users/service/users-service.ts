import { ObjectId } from 'mongodb';
import { TCreateNewUserRequest, UserCreateRequestModel } from '../types';
import { usersRepository } from '../repository';

export const usersService = {
    async createNewUser(req: TCreateNewUserRequest) {
        const { login, email } = req.body;
        const user = await usersRepository.findUserByLoginOrEmail({
            login,
            email,
        });
        if (user) {
            return {
                errorsMessages: [
                    {
                        message: 'User with this login or email already exists',
                        field: '',
                    },
                ],
            };
        }
        //TODO: add password encryption
        const newUser = {
            login,
            email,
            password: '',
            createdAt: new Date().toISOString(),
        };
        return await usersRepository.addNewUser(newUser);
    },

    async deleteUser(id: string) {
        const isDeleted = await usersRepository.deleteUser(new ObjectId(id));
        return isDeleted;
    },

    async setUsers(users: UserCreateRequestModel[]) {
        const mappedUsers = users.map((user) => {
            return {
                login: user.login,
                email: user.email,
                password: user.password,
                createdAt: new Date().toISOString(),
            };
        });
        await usersRepository.setUsers(mappedUsers);
    },
};
