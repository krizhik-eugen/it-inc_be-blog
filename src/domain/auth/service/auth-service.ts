import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { usersRepository } from '../../users';
import { jwtSecret } from '../../../app/configs';
import { AuthLoginRequestModel } from '../types';

export const authService = {
    async login({ loginOrEmail, password }: AuthLoginRequestModel) {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            return;
        }
        const isCredentialsValid = await bcrypt.compare(
            password,
            user.passwordHash
        );
        if (!isCredentialsValid) {
            return;
        }
        const accessToken = jwt.sign(
            { userId: user._id.toString() },
            jwtSecret,
            { expiresIn: '30d' }
        );
        return { accessToken };
    },
};
