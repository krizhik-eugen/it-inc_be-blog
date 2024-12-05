import { usersRepository } from '../repository';
import { createResponseError } from '../../helpers';

export const authService = {
    async login(re) {
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
        //TODO: add password encryption
        const newUser = {
            login,
            email,
            password,
            createdAt: new Date().toISOString(),
        };
        return await usersRepository.addNewUser(newUser);
    },
};
