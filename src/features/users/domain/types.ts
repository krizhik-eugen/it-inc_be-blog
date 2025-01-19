import { HydratedDocument, Model } from 'mongoose';
import { userMethods, userStatics } from './user-entity';

export type TUser = {
    accountData: {
        login: string;
        email: string;
        passwordHash: string;
    };
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date | '';
        isConfirmed: boolean;
    };
    passwordRecovery: {
        recoveryCode: string | null;
        expirationDate: Date | null;
    };
    createdAt: string;
};

export type UsersDBSearchParams = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
    sortBy: 'login' | 'email' | 'createdAt';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export type TCreateUserDTO = {
    login: string;
    email: string;
    passwordHash: string;
};

type UserStatics = typeof userStatics;
type UserMethods = typeof userMethods;

export type TUserModel = Model<TUser, object, UserMethods> & UserStatics;

export type UserDocument = HydratedDocument<TUser, UserMethods>;
