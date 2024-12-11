import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createResponseError } from '../../helpers';
import { usersRepository } from '../../users';
import { jwtSecret } from '../../configs/app-config';
import { AuthLoginRequestModel } from '../types';

export const authService = {
    async login({ loginOrEmail, password }: AuthLoginRequestModel) {
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
        const accessToken = jwt.sign(
            { userId: user._id.toString() },
            jwtSecret,
            { expiresIn: '30d' }
        );
        return { accessToken };
    },
};
