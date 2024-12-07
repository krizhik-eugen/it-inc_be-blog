import bcrypt from 'bcrypt';
import { createResponseError } from '../../helpers';
import { usersRepository } from '../../users';
import { TAuthLoginRequest } from '../types';

export const authService = {
    async login(req: TAuthLoginRequest) {
        const { loginOrEmail, password } = req.body;
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            return await Promise.resolve(
                createResponseError('Incorrect login or password')
            );
        }
        const isCredentialsValid = await bcrypt.compare(
            password,
            user.passwordHash
        );
        if (!isCredentialsValid) {
            return await Promise.resolve(
                createResponseError('Incorrect login or password')
            );
        }
        return isCredentialsValid;
    },
};
