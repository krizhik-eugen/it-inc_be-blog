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
    }: LoginRequestModel): Promise<TResult<{ accessToken: string }>> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('User not found')],
            };
        }
        if (user.emailConfirmation.isConfirmed) {
            return {
                status: 'BadRequest',
                errorsMessages: [createResponseError('This email has been already confirmed')],
            };
        }
        const isCredentialsValid = await bcrypt.compare(
            password,
            user.accountData.passwordHash
        );
        if (!isCredentialsValid) {
            return {
                status: 'BadRequest',
                errorsMessages: [createResponseError('Invalid credentials')],
            };
        }
        const accessToken = jwt.sign(
            { userId: user._id.toString() },
            jwtSecret,
            { expiresIn: '30d' }
        );
        return {
            status: 'Success',
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
                errorsMessages: [createResponseError('User with this login or email already exists')],
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
                data: null
            };
        } catch {
            usersRepository.deleteUser(new ObjectId(addedUserId));
            return {
                status: 'InternalError',
                errorsMessages: [createResponseError('Error sending email')],
            };
        }
    },

    async confirmEmail(code: string): Promise<TResult> {
        const user = await usersRepository.findUserByConfirmationCode(code);
        if (!user) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('User not found')]
            };
        }
        if (
            user.emailConfirmation.expirationDate &&
            user.emailConfirmation.expirationDate < new Date()
        ) {
            return {
                status: 'BadRequest',
                errorsMessages: [createResponseError('Confirmation code expired')],
            };
        }
        user.emailConfirmation.confirmationCode = null;
        user.emailConfirmation.expirationDate = null;
        user.emailConfirmation.isConfirmed = true;
        await usersRepository.updateUser(user);
        return {
            status: 'Success',
            data: null
        };
    },

    async resendConfirmationCode(email: string): Promise<TResult> {
        const user = await usersRepository.findUserByLoginOrEmail(email);
        if (!user) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('User not found')],
            };
        }
        if (user.emailConfirmation.isConfirmed) {
            return {
                status: 'BadRequest',
                errorsMessages: [createResponseError('Email already confirmed')],
            };
        }
        try {
            await emailManager.sendEmailConfirmationMessage();
            return {
                status: 'Success',
                data: null
            };
        } catch {
            return {
                status: 'InternalError',
                errorsMessages: [createResponseError('Error sending email')],
            };
        }
    },
};
