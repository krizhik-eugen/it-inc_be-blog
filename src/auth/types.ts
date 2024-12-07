import { Request, Response } from 'express';

export type AuthLoginRequestModel = {
    loginOrEmail: string;
    password: string;
};

export type MeViewModel = {
    userId: string;
    login: string;
    email: string;
};

export type TAuthLoginRequest = Request<object, object, AuthLoginRequestModel>;

export type TMeResponse = Response<MeViewModel>;
