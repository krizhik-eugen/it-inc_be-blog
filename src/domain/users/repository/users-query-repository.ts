import { Filter, ObjectId } from 'mongodb';
import { getDBSearchQueries } from '../../../shared/helpers';
import { usersCollection, UserDBModel, UsersDBSearchParams } from '../model';
import { UserViewModel } from '../types';
import { TMappedSearchQueryParams } from '../../../shared/types';

export const usersQueryRepository = {
    async getUsers({
        searchQueries,
        searchLoginTerm,
        searchEmailTerm,
    }: {
        searchQueries: TMappedSearchQueryParams<UsersDBSearchParams['sortBy']>;
        searchLoginTerm?: string;
        searchEmailTerm?: string;
    }) {
        const dbSearchQueries =
            getDBSearchQueries<UsersDBSearchParams['sortBy']>(searchQueries);
        const findQuery: Filter<UserDBModel> = {};
        const searchConditions: Filter<UserDBModel>[] = [];
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
            searchQueries.sortBy === 'createdAt'
                ? 'createdAt'
                : 'accountData.' + searchQueries.sortBy;
        const totalCount = await usersCollection.countDocuments(findQuery);
        const foundUsers = await usersCollection
            .find(findQuery)
            .sort({ [sortBySearchQuery]: searchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit)
            .toArray();
        const mappedFoundUsers: UserViewModel[] = foundUsers
            ? foundUsers.map((user: Required<UserDBModel>) => ({
                  id: user._id.toString(),
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
    },

    async getUser(id: string) {
        const user = await usersCollection.findOne({
            _id: new ObjectId(id),
        });
        if (!user) return undefined;
        return {
            id: user._id.toString(),
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.createdAt,
        };
    },
};
