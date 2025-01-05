import { model, Schema } from 'mongoose';

export interface UserDBModel {
    accountData: {
        login: string;
        email: string;
        passwordHash: string;
    };
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date | '';
        isConfirmed: 'Confirmed' | 'NotConfirmed';
    };
    passwordRecovery: {
        recoveryCode: string;
        expirationDate: Date | '';
    };
    createdAt: string;
}

export type UsersDBSearchParams = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
    sortBy: 'login' | 'email' | 'createdAt';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

const usersSchema = new Schema<UserDBModel>({
    accountData: {
        login: String,
        email: String,
        passwordHash: String,
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: String,
    },
    passwordRecovery: {
        recoveryCode: String,
        expirationDate: Date,
    },
    createdAt: String,
});

export const UsersModel = model('users', usersSchema);
