import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { usersRepository } from '../../users';
import { jwtSecret } from '../../../app/configs';
import { LoginRequestModel, RegisterRequestModel } from '../types';
import { createResponseError } from '../../../shared/helpers';
import { UserDBModel } from '../../users/model';
import { add } from 'date-fns';
import { emailManager } from '../../../app/managers';
import { ObjectId } from 'mongodb';
import { TResult } from '../../../shared/types';

export const authService = {
    async login({
        loginOrEmail,
        password,
    }: LoginRequestModel): Promise<TResult<{ accessToken: string } | null>> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user || !user.emailConfirmation.isConfirmed) {
            return {
                status: 'NotFound',
                errorMessage: 'User not found',
                extensions: [],
                data: null,
            };
        }
        if (!user.emailConfirmation.isConfirmed) {
            return {
                status: 'BadRequest',
                errorMessage: 'This email has been already confirmed',
                extensions: [],
                data: null,
            };
        }
        const isCredentialsValid = await bcrypt.compare(
            password,
            user.accountData.passwordHash
        );
        if (!isCredentialsValid) {
            return {
                status: 'BadRequest',
                errorMessage: 'Invalid credentials',
                extensions: [],
                data: null,
            };
        }
        const accessToken = jwt.sign(
            { userId: user._id.toString() },
            jwtSecret,
            { expiresIn: '30d' }
        );
        return {
            status: 'Success',
            extensions: [],
            data: { accessToken },
        };
    },

    async createUser({
        login,
        email,
        password,
    }: RegisterRequestModel): Promise<TResult> {
        const user = await usersRepository.findUserByLoginOrEmail(
            login || email
        );
        if (user) {
            return {
                status: 'BadRequest',
                errorMessage: 'User with this login or email already exists',
                extensions: [
                    {
                        field: null,
                        message: 'User with this login or email already exists',
                    },
                ],
                data: null,
            };
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
        const addedUserId = await usersRepository.addNewUser(newUser);
        try {
            await emailManager.sendEmailConfirmationMessage();
            return {
                status: 'Success',
                extensions: [],
                data: null,
            };
        } catch {
            usersRepository.deleteUser(new ObjectId(addedUserId));
            return {
                status: 'InternalError',
                errorMessage: 'Error sending email',
                extensions: [],
                data: null,
            };
        }
    },

    async confirmEmail(code: string): Promise<TResult> {
        const user = await usersRepository.findUserByConfirmationCode(code);
        if (!user) {
            return {
                status: 'NotFound',
                errorMessage: 'User not found',
                extensions: [],
                data: null,
            };
        }
        if (
            user.emailConfirmation.expirationDate &&
            user.emailConfirmation.expirationDate < new Date()
        ) {
            return {
                status: 'BadRequest',
                errorMessage: 'Confirmation code expired',
                extensions: [],
                data: null,
            };
        }
        user.emailConfirmation.confirmationCode = null;
        user.emailConfirmation.expirationDate = null;
        user.emailConfirmation.isConfirmed = true;
        await usersRepository.updateUser(user);
        return {
            status: 'Success',
            extensions: [],
            data: null,
        };
    },

    async resendConfirmationCode(email: string): Promise<TResult> {
        const user = await usersRepository.findUserByLoginOrEmail(email);
        if (!user) {
            return {
                status: 'NotFound',
                errorMessage: 'User not found',
                extensions: [],
                data: null,
            };
        }
        if (user.emailConfirmation.isConfirmed) {
            return {
                status: 'BadRequest',
                errorMessage: 'Email already confirmed',
                extensions: [],
                data: null,
            };
        }
        try {
            await emailManager.sendEmailConfirmationMessage();
            return {
                status: 'Success',
                extensions: [],
                data: null,
            };
        } catch {
            return {
                status: 'InternalError',
                errorMessage: 'Error sending email',
                extensions: [],
                data: null,
            };
        }
    },
};
