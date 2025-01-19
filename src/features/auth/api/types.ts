import { Request } from 'express';
import { TResponseWithError } from '../../../shared/types';

export type MeViewModel = {
    userId: string;
    login: string;
    email: string;
};

export type LoginRequestModel = {
    loginOrEmail: string;
    password: string;
};

export type RegisterRequestModel = {
    login: string;
    email: string;
    password: string;
};

export type ConfirmationRequestModel = {
    code: string;
};

export type ResendRegistrationEmailRequestModel = {
    email: string;
};

export type PasswordRecoveryRequestModel = {
    email: string;
};

export type NewPasswordRequestModel = {
    newPassword: string;
    recoveryCode: string;
};

export type TMeResponse = TResponseWithError<MeViewModel>;

export type TLoginRequest = Request<object, object, LoginRequestModel>;

export type TLoginResponse = TResponseWithError<{ accessToken: string }>;

export type TRegisterRequest = Request<object, object, RegisterRequestModel>;

export type TPasswordRecoveryRequest = Request<
    object,
    object,
    PasswordRecoveryRequestModel
>;

export type TNewPasswordRequest = Request<
    object,
    object,
    NewPasswordRequestModel
>;

export type TConfirmationRequest = Request<
    object,
    object,
    ConfirmationRequestModel
>;

export type TResendRegistrationEmailRequest = Request<
    object,
    object,
    ResendRegistrationEmailRequestModel
>;

export type TTokens = { accessToken: string; refreshToken: string };
