import { TCreateNewUserRequest, UserCreateRequestModel } from '../types';
import { usersRepository } from '../repository';
import { ObjectId } from 'mongodb';

export const usersService = {
    async createNewUser(req: TCreateNewUserRequest) {
        const { login, email } = req.body;

        const user = await usersRepository.findUserByLoginOrEmail({login, email});
        if (user) {
            return {
                errorsMessages: [
                    {
                        message: 'User with this login or email already exists', 
                        field: ''
                    }
                ]
            };
        }

        //TODO: add password encryption
        const newUser = { login, email, password: '', createdAt: new Date().toISOString() };
        const newUserId = await usersRepository.addNewUser(newUser);
        const addedUser = await usersRepository.findUserById(new ObjectId(newUserId))
        if (!addedUser) {
            return undefined;
        }
        return {
            id: addedUser._id.toString(),
            login: addedUser.login,
            email: addedUser.email,
            createdAt: addedUser.createdAt,
        };
    },

    async deleteUser(id: string) {
        const isDeleted = await usersRepository.deleteUser(new ObjectId(id));
        return isDeleted;
    },

    async setUsers (users: UserCreateRequestModel[]) {
        const mappedUsers = users.map((user) => {
            return {
                login: user.login,
                email: user.email,
                password: user.password,
                createdAt: new Date().toISOString(),
        }});
        await usersRepository.setUsers(mappedUsers);
    }
};
