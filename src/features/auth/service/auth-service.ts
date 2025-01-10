import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import {
    LoginRequestModel,
    NewPasswordRequestModel,
    PasswordRecoveryRequestModel,
    RegisterRequestModel,
    TTokens,
} from '../types';
import {
    badRequestErrorResult,
    internalErrorResult,
    notFoundErrorResult,
    successResult,
    unauthorizedErrorResult,
} from '../../../shared/helpers';
import { UserDBModel } from '../../users/model';
import { EmailManager } from '../../../app/managers';
import { TResult } from '../../../shared/types';
import { JwtService, TDecodedToken } from '../../../app/services';
import { getCodeExpirationDate, hashSaltRounds } from '../../../app/configs';
import { SessionsRepository } from '../../security/repository';
import { UsersRepository } from '../../users/repository';

export class AuthService {
    constructor(
        protected usersRepository: UsersRepository,
        protected sessionsRepository: SessionsRepository,
        protected jwtService: JwtService,
        protected emailManager: EmailManager
    ) { }

    async login(
        { loginOrEmail, password }: LoginRequestModel,
        deviceTitle: string,
        ip: string
    ): Promise<TResult<TTokens>> {
        const user =
            await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!user) {
            return notFoundErrorResult('User not found');
        }
        if (user.emailConfirmation.isConfirmed === 'NotConfirmed') {
            return badRequestErrorResult('This email has not been confirmed');
        }
        const isCredentialsValid = await bcrypt.compare(
            password,
            user.accountData.passwordHash
        );
        if (!isCredentialsValid) {
            return badRequestErrorResult('Invalid credentials');
        }
        const accessToken = this.jwtService.generateAccessToken(
            user._id.toString()
        );
        const deviceId = uuidv4();
        const refreshToken = this.jwtService.generateRefreshToken(
            user._id.toString(),
            deviceId
        );
        const decodedIssuedToken = this.jwtService.decodeToken(refreshToken);
        await this.sessionsRepository.createSession({
            userId: user._id.toString(),
            deviceId,
            ip,
            deviceName: deviceTitle,
            iat: decodedIssuedToken.iat!,
            exp: decodedIssuedToken.exp!,
        });
        return successResult({ accessToken, refreshToken });
    }

    async createUser({
        login,
        email,
        password,
    }: RegisterRequestModel): Promise<TResult> {
        const foundUserByLogin =
            await this.usersRepository.findUserByLoginOrEmail(login);
        const foundUserByEmail =
            await this.usersRepository.findUserByLoginOrEmail(email);
        if (foundUserByLogin || foundUserByEmail) {
            return badRequestErrorResult(
                'User with this login or email already exists',
                foundUserByLogin ? 'login' : 'email'
            );
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
            passwordRecovery: {
                recoveryCode: '',
                expirationDate: '',
            },
            createdAt: new Date().toISOString(),
        };
        await this.usersRepository.addNewUser(newUser);
        // try {
        this.emailManager
            .sendEmailConfirmationMessage(
                newUser.accountData.email,
                newUser.emailConfirmation.confirmationCode!
            )
            .catch((e: unknown) => console.log(e));
        return successResult(null);
        // }
        // catch {
        //     await usersRepository.deleteUser(addedUserId);
        //     return internalErrorResult('Error sending email')
        // }
    }

    async confirmEmail(code: string): Promise<TResult> {
        const user =
            await this.usersRepository.findUserByConfirmationCode(code);
        if (!user) {
            return badRequestErrorResult(
                'No user found for this confirmation code'
            );
        }
        if (user.emailConfirmation.isConfirmed === 'Confirmed') {
            return badRequestErrorResult('Code already confirmed', 'code');
        }
        if (
            user.emailConfirmation.expirationDate &&
            user.emailConfirmation.expirationDate < new Date()
        ) {
            return badRequestErrorResult('Confirmation code expired');
        }

        await this.usersRepository.updateUser({
            id: user._id.toString(),
            emailConfirmation: {
                ...user.emailConfirmation,
                isConfirmed: 'Confirmed',
            },
        });
        return successResult(null);
    }

    async resendConfirmationCode(email: string): Promise<TResult> {
        const user = await this.usersRepository.findUserByLoginOrEmail(email);
        if (!user) {
            return badRequestErrorResult(
                'No user found with this email',
                'email'
            );
        }
        if (user.emailConfirmation.isConfirmed === 'Confirmed') {
            return badRequestErrorResult('Email already confirmed', 'email');
        }
        const confirmationCode = uuidv4();
        await this.usersRepository.updateUser({
            id: user._id.toString(),
            emailConfirmation: {
                isConfirmed: 'NotConfirmed',
                confirmationCode,
                expirationDate: getCodeExpirationDate(),
            },
        });
        try {
            await this.emailManager.sendEmailConfirmationMessage(
                user.accountData.email,
                confirmationCode
            );
            return successResult(null);
        } catch {
            return internalErrorResult('Error sending email');
        }
    }

    async createNewSession(
        refreshToken: string,
        ip: string
    ): Promise<TResult<TTokens>> {
        const validationResult = await this.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        const updatedAccessToken = this.jwtService.generateAccessToken(
            validationResult.data.userId
        );
        const updatedRefreshToken = this.jwtService.generateRefreshToken(
            validationResult.data.userId,
            validationResult.data.deviceId
        );
        const decodedIssuedToken =
            this.jwtService.decodeToken(updatedRefreshToken);
        await this.sessionsRepository.updateSession({
            deviceId: validationResult.data.deviceId,
            iat: decodedIssuedToken.iat!,
            exp: decodedIssuedToken.exp!,
            ip,
        });
        return successResult({
            accessToken: updatedAccessToken,
            refreshToken: updatedRefreshToken,
        });
    }

    async logout(refreshToken: string): Promise<TResult> {
        const validationResult = await this.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }
        await this.sessionsRepository.revokeSession(
            validationResult.data.deviceId
        );
        return successResult(null);
    }

    async passwordRecovery({
        email,
    }: PasswordRecoveryRequestModel): Promise<TResult> {
        const foundUserByEmail =
            await this.usersRepository.findUserByLoginOrEmail(email);
        if (foundUserByEmail) {
            const recoveryCode = uuidv4();
            await this.usersRepository.updateUser({
                id: foundUserByEmail._id.toString(),
                passwordRecovery: {
                    recoveryCode,
                    expirationDate: getCodeExpirationDate(),
                },
            });
            // try {
            this.emailManager
                .sendEmailPasswordRecoveryMessage(email, recoveryCode)
                .catch((e: unknown) => console.log(e));
        }
        return successResult(null);
        // }
        // catch {
        //     await usersRepository.deleteUser(addedUserId);
        //     return internalErrorResult('Error sending email')
        // }
    }

    async newPassword({
        newPassword,
        recoveryCode,
    }: NewPasswordRequestModel): Promise<TResult> {
        const user =
            await this.usersRepository.findUserByRecoveryCode(recoveryCode);
        if (!user) {
            return badRequestErrorResult(
                'Recovery code is not correct',
                'recoveryCode'
            );
        }
        if (
            user.passwordRecovery.expirationDate &&
            user.passwordRecovery.expirationDate < new Date()
        ) {
            return badRequestErrorResult(
                'Recovery code expired',
                'recoveryCode'
            );
        }
        const newPasswordHash = await bcrypt.hash(newPassword, hashSaltRounds);
        await this.usersRepository.updateUser({
            id: user._id.toString(),
            accountData: { ...user.accountData, passwordHash: newPasswordHash },
            passwordRecovery: { recoveryCode: '', expirationDate: '' },
        });
        return successResult(null);
    }

    async validateRefreshToken(
        refreshToken: string
    ): Promise<TResult<TDecodedToken>> {
        const result = this.jwtService.verifyToken(refreshToken);
        if (result.error) {
            if (result.data) {
                await this.sessionsRepository.revokeSession(
                    result.data.deviceId
                );
            }
            return unauthorizedErrorResult('Refresh token verification error');
        }
        const user = await this.usersRepository.findUserById(
            result.data.userId
        );
        if (!user) {
            return unauthorizedErrorResult('User not found');
        }
        const session = await this.sessionsRepository.findSession(
            result.data.deviceId
        );
        if (!session) {
            return unauthorizedErrorResult('Session not found');
        }
        if (session.iat !== result.data.iat) {
            return unauthorizedErrorResult('Invalid token');
        }
        return successResult(result.data);
    }
}
