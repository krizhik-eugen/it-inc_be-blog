import { inject, injectable } from 'inversify';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailManager } from '../../../app/managers/email-manager';
import { JwtService, TDecodedToken } from '../../../app/services/jwt-service';
import {
    badRequestErrorResult,
    notFoundErrorResult,
    successResult,
    unauthorizedErrorResult,
} from '../../../shared/helpers';
import { TResult } from '../../../shared/types';
import { UsersRepository } from '../../users/infrastructure/users-repository';
import { SessionsRepository } from '../../security/infrastructure/sessions-repository';
import {
    LoginRequestModel,
    NewPasswordRequestModel,
    PasswordRecoveryRequestModel,
    RegisterRequestModel,
    TTokens,
} from '../api/types';
import { hashSaltRounds } from '../../../app/configs/app-config';
import { UserModel } from '../../users/domain/user-entity';
import { SessionModel } from '../../security/domain/session-entity';

@injectable()
export class AuthService {
    constructor(
        @inject(UsersRepository) protected usersRepository: UsersRepository,
        @inject(SessionsRepository)
        protected sessionsRepository: SessionsRepository,
        @inject(JwtService) protected jwtService: JwtService,
        @inject(EmailManager) protected emailManager: EmailManager
    ) {}

    async login(
        { loginOrEmail, password }: LoginRequestModel,
        deviceTitle: string,
        ip: string
    ): Promise<TResult<TTokens>> {
        const foundUser =
            await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
        if (!foundUser) {
            return notFoundErrorResult('User not found');
        }
        if (!foundUser.emailConfirmation.isConfirmed) {
            return badRequestErrorResult('The email has not been confirmed');
        }

        const isCredentialsValid = await bcrypt.compare(
            password,
            foundUser.accountData.passwordHash
        );
        if (!isCredentialsValid) {
            return badRequestErrorResult('Invalid credentials');
        }

        const deviceId = uuidv4();
        const accessToken = this.jwtService.generateAccessToken(foundUser.id);
        const refreshToken = this.jwtService.generateRefreshToken(
            foundUser.id,
            deviceId
        );
        const decodedIssuedToken = this.jwtService.decodeToken(refreshToken);

        const newSession = SessionModel.createSession({
            userId: foundUser.id,
            deviceId,
            ip,
            deviceName: deviceTitle,
            iat: decodedIssuedToken.iat!,
            exp: decodedIssuedToken.exp!,
        });

        await this.sessionsRepository.save(newSession);

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

        const newUser = UserModel.createNewUser({
            login,
            email,
            passwordHash,
        });

        await this.usersRepository.save(newUser);

        this.emailManager
            .sendEmailConfirmationMessage(
                newUser.accountData.email,
                newUser.emailConfirmation.confirmationCode!
            )
            .catch((e: unknown) => console.log(e));

        return successResult(null);
    }

    async confirmEmail(code: string): Promise<TResult> {
        const foundUser =
            await this.usersRepository.findUserByConfirmationCode(code);
        if (!foundUser) {
            return badRequestErrorResult(
                'No user found for this confirmation code'
            );
        }

        const result = foundUser.confirmUserEmail(code);
        if (result.error) {
            return badRequestErrorResult(result.error, 'code');
        }

        await this.usersRepository.save(foundUser);

        return successResult(null);
    }

    async resendConfirmationCode(email: string): Promise<TResult> {
        const foundUser =
            await this.usersRepository.findUserByLoginOrEmail(email);
        if (!foundUser) {
            return badRequestErrorResult(
                'No user found with this email',
                'email'
            );
        }
        const result = foundUser.updateConfirmationCode();
        if (result.error) {
            return badRequestErrorResult(result.error, 'email');
        }

        await this.usersRepository.save(foundUser);

        this.emailManager
            .sendEmailConfirmationMessage(
                foundUser.accountData.email,
                foundUser.emailConfirmation.confirmationCode
            )
            .catch((e: unknown) => console.log(e));
        return successResult(null);
    }

    async createNewSession(
        refreshToken: string,
        ip: string
    ): Promise<TResult<TTokens>> {
        const validationResult = await this.validateRefreshToken(refreshToken);
        if (validationResult.status !== 'Success') {
            return validationResult;
        }

        const foundSession =
            await this.sessionsRepository.findSessionByDeviceId(
                validationResult.data.deviceId
            );
        if (!foundSession) {
            return notFoundErrorResult('Session not found');
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

        foundSession.ip = ip;
        foundSession.iat = decodedIssuedToken.iat!;
        foundSession.exp = decodedIssuedToken.exp!;

        await this.sessionsRepository.save(foundSession);

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
        await this.sessionsRepository.deleteSessionByDeviceId(
            validationResult.data.deviceId
        );
        return successResult(null);
    }

    async passwordRecovery({
        email,
    }: PasswordRecoveryRequestModel): Promise<TResult> {
        const foundUser =
            await this.usersRepository.findUserByLoginOrEmail(email);

        if (foundUser) {
            const recoveryCode = foundUser.createPasswordRecoveryCode();
            await this.usersRepository.save(foundUser);

            this.emailManager
                .sendEmailPasswordRecoveryMessage(email, recoveryCode)
                .catch((e: unknown) => console.log(e));
        }

        return successResult(null);
    }

    async newPassword({
        recoveryCode,
        newPassword,
    }: NewPasswordRequestModel): Promise<TResult> {
        const foundUser =
            await this.usersRepository.findUserByRecoveryCode(recoveryCode);
        if (!foundUser) {
            return badRequestErrorResult(
                'Recovery code is not correct',
                'recoveryCode'
            );
        }

        const newPasswordHash = await bcrypt.hash(newPassword, hashSaltRounds);

        const result = foundUser.changePasswordWithRecoveryCode(
            recoveryCode,
            newPasswordHash
        );

        if (result.error) {
            return badRequestErrorResult(result.error, 'recoveryCode');
        }

        await this.usersRepository.save(foundUser);

        return successResult(null);
    }

    async validateRefreshToken(
        refreshToken: string
    ): Promise<TResult<TDecodedToken>> {
        const result = this.jwtService.verifyToken(refreshToken);
        if (result.error) {
            if (result.data) {
                await this.sessionsRepository.deleteSessionByDeviceId(
                    result.data.deviceId
                );
            }
            return unauthorizedErrorResult('Refresh token verification error');
        }
        const foundUser = await this.usersRepository.findUserById(
            result.data.userId
        );
        if (!foundUser) {
            return unauthorizedErrorResult('User not found');
        }
        const session = await this.sessionsRepository.findSessionByDeviceId(
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
