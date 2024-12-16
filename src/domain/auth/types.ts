import { Request, Response } from 'express';
import { createResponseError } from '../../shared/helpers';

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

export type TLoginRequest = Request<object, object, LoginRequestModel>;

export type TRegisterRequest = Request<object, object, RegisterRequestModel>;

export type TRegisterResponse = Response<
    undefined | { errorsMessages: { field: string | null; message: string }[] }
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
