import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';
import { getDBSearchQueries } from '../../../shared/helpers';
import {
    AllItemsViewModel,
    TMappedSearchQueryParams,
} from '../../../shared/types';
import { UserViewModel } from '../api/types';
import { TUser, UsersDBSearchParams } from '../domain/types';
import { UserModel } from '../domain/user-entity';

@injectable()
export class UsersQueryRepository {
    async getUsers({
        searchQueries,
        searchLoginTerm,
        searchEmailTerm,
    }: {
        searchQueries: TMappedSearchQueryParams<UsersDBSearchParams['sortBy']>;
        searchLoginTerm?: string;
        searchEmailTerm?: string;
    }): Promise<AllItemsViewModel<UserViewModel>> {
        const dbSearchQueries =
            getDBSearchQueries<UsersDBSearchParams['sortBy']>(searchQueries);
        const findQuery: FilterQuery<TUser> = {};
        const searchConditions: FilterQuery<TUser>[] = [];
        if (searchLoginTerm) {
            searchConditions.push({
                'accountData.login': { $regex: searchLoginTerm, $options: 'i' },
            });
        }
        if (searchEmailTerm) {
            searchConditions.push({
                'accountData.email': { $regex: searchEmailTerm, $options: 'i' },
            });
        }
        if (searchConditions.length > 0) {
            findQuery.$or = searchConditions;
        }
        const sortBySearchQuery =
            searchQueries.sortBy === 'login' || searchQueries.sortBy === 'email'
                ? 'accountData.' + searchQueries.sortBy
                : searchQueries.sortBy;
        const totalCount = await UserModel.countDocuments(findQuery);
        const foundUsers = await UserModel.find(findQuery)
            .sort({ [sortBySearchQuery]: searchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const mappedFoundUsers: UserViewModel[] = foundUsers
            ? foundUsers.map((user) => ({
                  id: user.id,
                  login: user.accountData.login,
                  email: user.accountData.email,
                  createdAt: user.createdAt,
              }))
            : [];
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount: totalCount,
            items: mappedFoundUsers,
        };
    }

    async getUser(id: string): Promise<UserViewModel | null> {
        const user = await UserModel.findById(id);
        if (!user) return null;
        return {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.createdAt,
        };
    }
}
