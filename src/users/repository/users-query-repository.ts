import { Filter, ObjectId } from 'mongodb';
import { getDBSearchQueries, getSearchQueries } from '../../helpers';
import { usersCollection, UserDBModel, UsersDBSearchParams } from '../model';
import {
    AllUsersResponseModel,
    TGetAllUsersRequest,
    UserViewModel,
} from '../types';

export const usersQueryRepository = {
    async getUsers(req: TGetAllUsersRequest): Promise<AllUsersResponseModel> {
        const { searchLoginTerm, searchEmailTerm, ...restQueries } = req.query;
        const searchQueries =
            getSearchQueries<UsersDBSearchParams['sortBy']>(restQueries);
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

    async getUser(id: UserViewModel['id']) {
        return await usersCollection.findOne({
            _id: new ObjectId(id),
        });
    },

    async getUserByLoginOrEmail(
        loginOrEmail: UserViewModel['login'] | UserViewModel['email']
    ) {
        return await usersCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        });
    },
};
