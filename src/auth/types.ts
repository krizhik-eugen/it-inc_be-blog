import { Request } from 'express';

export type AuthLoginRequestModel = {
    loginOrEmail: string;
    password: string;
};

export type TAuthLoginRequest = Request<object, object, AuthLoginRequestModel>;
