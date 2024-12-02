import { TCreateNewUserRequest, TCreateUpdatePostRequest, TPostSearchParams } from '../types';
import { postsRepository, usersRepository } from '../repository';
import { getDBSearchQueries, getSearchQueries } from '../../helpers';
import { blogsRepository } from '../../blogs';

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
        const addedUser = await usersRepository.findUserById(newUserId)
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
};
