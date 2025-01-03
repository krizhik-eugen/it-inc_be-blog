import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { usersRepository } from '../../users';
import { LoginRequestModel, RegisterRequestModel, TTokens } from '../types';
import { createResponseError } from '../../../shared/helpers';
import { UserDBModel } from '../../users/model';
import { emailManager } from '../../../app/managers';
import { TResult } from '../../../shared/types';
import { jwtService, TDecodedToken } from '../../../app/services';
import { getCodeExpirationDate, hashSaltRounds } from '../../../app/configs';
import { sessionsRepository } from '../../security';

export const authService = {
    async login(
        { loginOrEmail, password }: LoginRequestModel,
        deviceTitle: string,
        ip: string
    ): Promise<TResult<TTokens>> {
        const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            return {
                status: 'NotFound',
                errorsMessages: [createResponseError('User not found')],
            };
        }
        if (user.emailConfirmation.isConfirmed === 'NotConfirmed') {
            return {
                status: 'BadRequest',
                errorsMessages: [
                    createResponseError('This email has not been confirmed'),
                ],
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
        const accessToken = jwtService.generateAccessToken(user.id);
        const deviceId = uuidv4();
        const refreshToken = jwtService.generateRefreshToken(
            user.id!,
            deviceId
        );
        const decodedIssuedToken = jwtService.decodeToken(refreshToken);
        await sessionsRepository.createSession({
            userId: user.id!,
            deviceId,
            ip,
            deviceName: deviceTitle,
            iat: decodedIssuedToken.iat!,
            exp: decodedIssuedToken.exp!,
        });
        return {
            status: 'Success',
            data: { accessToken, refreshToken },
        };
    },

    async createUser({
        login,
        email,
        password,
    }: RegisterRequestModel): Promise<TResult> {
        const foundUserByLogin =
            await usersRepository.findUserByLoginOrEmail(login);
        const foundUserByEmail =
            await usersRepository.findUserByLoginOrEmail(email);
        if (foundUserByLogin || foundUserByEmail) {
            return {
                status: 'BadRequest',
                errorsMessages: [
                    createResponseError(
                        'User with this login or email already exists',
                        foundUserByLogin ? 'login' : 'email'
                    ),
                ],
            };
        }
        const passwordHash = await bcrypt.hash(password, hashSaltRounds);
        const newUser: UserDBModel = {
            accountData: {
                login,
                email,
                passwordHash,
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: getCodeExpirationDate(),
                isConfirmed: 'NotConfirmed',
            },
            createdAt: new Date().toISOString(),
        };
        await usersRepository.addNewUser(newUser);
        // try {
        emailManager
            .sendEmailConfirmationMessage(
                newUser.accountData.email,
                newUser.emailConfirmation.confirmationCode!
            )
            .catch((e) => console.log(e));
        return {
            status: 'Success',
            data: null,
        };
        // }
        // catch {
        //     await usersRepository.deleteUser(addedUserId);
        //     return {
        //         status: 'InternalError',
        //         errorsMessages: [createResponseError('Error sending email')],
        //     };
        // }
    },

    async confirmEmail(code: string): Promise<TResult> {
        const user = await usersRepository.findUserByConfirmationCode(code);
        if (!user) {
            return {
                status: 'BadRequest',
                errorsMessages: [
                    createResponseError(
                        'No user found for this confirmation code'
                    ),
                ],
            };
        }
        if (user.emailConfirmation.isConfirmed === 'Confirmed') {
            return {
                status: 'BadRequest',
                errorsMessages: [
                    createResponseError('Code already confirmed', 'code'),
                ],
            };
        }
        if (
            user.emailConfirmation.expirationDate &&
            user.emailConfirmation.expirationDate < new Date()
        ) {
            return {
                status: 'BadRequest',
                errorsMessages: [
                    createResponseError('Confirmation code expired'),
                ],
            };
        }
        user.emailConfirmation.isConfirmed = 'Confirmed';
        await usersRepository.updateUser(user);
        return {
            status: 'Success',
            data: null,
        };
    },

    async resendConfirmationCode(email: string): Promise<TResult> {
        const user = await usersRepository.findUserByLoginOrEmail(email);
        if (!user) {
            return {
                status: 'BadRequest',
                errorsMessages: [
                    createResponseError(
                        'No user found with this email',
                        'email'
                    ),
                ],
            };
        }
        if (user.emailConfirmation.isConfirmed === 'Confirmed') {
            return {
                status: 'BadRequest',
                errorsMessages: [
                    createResponseError('Email already confirmed', 'email'),
                ],
            };
        }

        const updatedUser: UserDBModel = {
            ...user,
            emailConfirmation: {
                isConfirmed: 'NotConfirmed',
                confirmationCode: uuidv4(),
                expirationDate: getCodeExpirationDate(),
            },
        };
        await usersRepository.updateUser(updatedUser);
        try {
            await emailManager.sendEmailConfirmationMessage(
                user.accountData.email,
                updatedUser.emailConfirmation.confirmationCode!
            );
            return {
                status: 'Success',
                data: null,
            };
        } catch {
            return {
                status: 'InternalError',
                errorsMessages: [createResponseError('Error sending email')],
            };
        }
    },

    async createNewSession(
        refreshToken: string,
        ip: string
    ): Promise<TResult<TTokens>> {
        const validationResult = await this.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        const updatedAccessToken = jwtService.generateAccessToken(
            validationResult.data.userId
        );
        const updatedRefreshToken = jwtService.generateRefreshToken(
            validationResult.data.userId,
            validationResult.data.deviceId
        );
        const decodedIssuedToken = jwtService.decodeToken(updatedRefreshToken);
        await sessionsRepository.updateSession({
            deviceId: validationResult.data.deviceId,
            iat: decodedIssuedToken.iat!,
            exp: decodedIssuedToken.exp!,
            ip,
        });
        return {
            status: 'Success',
            data: {
                accessToken: updatedAccessToken,
                refreshToken: updatedRefreshToken,
            },
        };
    },

    async logout(refreshToken: string): Promise<TResult> {
        const validationResult = await this.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        await sessionsRepository.revokeSession(validationResult.data.deviceId);
        return {
            status: 'Success',
            data: null,
        };
    },

    async validateRefreshToken(
        refreshToken: string
    ): Promise<TResult<TDecodedToken>> {
        const result = jwtService.verifyToken(refreshToken);
        if (result.error) {
            if (result.data) {
                await sessionsRepository.revokeSession(result.data.deviceId);
            }
            return {
                status: 'Unauthorized',
                errorsMessages: [
                    createResponseError('Refresh token verification error'),
                ],
            };
        }
        const user = await usersRepository.findUserById(result.data.userId);
        if (!user) {
            return {
                status: 'Unauthorized',
                errorsMessages: [createResponseError('User not found')],
            };
        }
        const session = await sessionsRepository.findSession(
            result.data.deviceId
        );
        if (!session) {
            return {
                status: 'Unauthorized',
                errorsMessages: [createResponseError('Session not found')],
            };
        }
        if (session.iat !== result.data.iat) {
            return {
                status: 'Unauthorized',
                errorsMessages: [createResponseError('Invalid token')],
            };
        }
        return {
            status: 'Success',
            data: result.data,
        };
    },
};
