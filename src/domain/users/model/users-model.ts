import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../../db';

export type UserDBModel = OptionalUnlessRequiredId<{
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
    revokedRefreshTokens: string[];
}>;

export type UsersDBSearchParams = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
    sortBy: 'login' | 'email' | 'createdAt';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export const usersCollection = db.collection<UserDBModel>('users');
