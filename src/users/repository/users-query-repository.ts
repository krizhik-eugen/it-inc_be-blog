import { Filter, ObjectId } from 'mongodb';
import { getDBSearchQueries } from '../../helpers';
import { usersCollection, UserDBModel, UsersDBSearchParams } from '../model';
import { AllUsersResponseModel, UserViewModel } from '../types';
import { TMappedSearchQueryParams } from '../../common-types';

export const usersQueryRepository = {
    async getUsers({
        searchQueries,
        searchLoginTerm,
        searchEmailTerm,
    }: {
        searchQueries: TMappedSearchQueryParams<UsersDBSearchParams['sortBy']>;
        searchLoginTerm?: string;
        searchEmailTerm?: string;
    }): Promise<AllUsersResponseModel> {
        const dbSearchQueries =
            getDBSearchQueries<UsersDBSearchParams['sortBy']>(searchQueries);
        const findQuery: Filter<Pick<UserDBModel, 'login' | 'email'>> = {};
        const searchConditions = [];
        if (searchLoginTerm) {
            searchConditions.push({
                login: { $regex: searchLoginTerm, $options: 'i' },
            });
        }
        if (searchEmailTerm) {
            searchConditions.push({
                email: { $regex: searchEmailTerm, $options: 'i' },
            });
        }
        if (searchConditions.length > 0) {
            findQuery.$or = searchConditions;
        }
        const totalCount = await usersCollection.countDocuments(findQuery);
        const foundUsers = await usersCollection
            .find(findQuery)
            .sort({ [searchQueries.sortBy]: searchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit)
            .toArray();
        const mappedFoundUsers: UserViewModel[] = foundUsers
            ? foundUsers.map((user: Required<UserDBModel>) => ({
                  id: user._id.toString(),
                  login: user.login,
                  email: user.email,
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
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        };
    },
};
