import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../db';

export type UserDBModel = OptionalUnlessRequiredId<{
    login: string;
    email: string;
    createdAt: string;
    password: string;
}>;

export type UsersDBSearchParams = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
    sortBy: 'login' | 'email' | 'createdAt';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export const usersCollection =
    db.collection<UserDBModel>('users');
