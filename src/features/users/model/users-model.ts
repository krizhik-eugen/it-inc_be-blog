import { model, Schema } from 'mongoose';

export interface UserDBModel {
    accountData: {
        login: string;
        email: string;
        passwordHash: string;
    };
    emailConfirmation: {
        confirmationCode: string | null;
        expirationDate: Date | null;
        isConfirmed: 'Confirmed' | 'NotConfirmed';
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
    createdAt: String,
});

export const UsersModel = model('users', usersSchema);
