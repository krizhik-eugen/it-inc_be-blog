import { OptionalUnlessRequiredId } from 'mongodb';
import { db } from '../../db';

export type UsersDBModel = OptionalUnlessRequiredId<{
    login: string;
    email: string;
    createdAt: string;
    password: string;
}>;

export type UsersDBSearchParams = {
    searchLoginTerm?: string;
    searchEmailTerm?: string;
    term?: string;
    sortBy: UsersDBModel['createdAt'] ;
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

export const usersCollection =
    db.collection<UsersDBModel>('users');
