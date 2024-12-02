import { getDBSearchQueries, getSearchQueries } from '../../helpers';
import { usersCollection, UserDBModel, UsersDBSearchParams } from '../model';
import { AllUsersResponseModel, TGetAllUsersRequest, UserViewModel } from '../types';


export const usersQueryRepository = {
    async getUsers(req: TGetAllUsersRequest): Promise<AllUsersResponseModel> {
        const { searchLoginTerm: login, searchEmailTerm: email, ...restQueries } = req.query;
        const searchQueries = getSearchQueries<UsersDBSearchParams['sortBy']>(restQueries);
        const dbSearchQueries = getDBSearchQueries<UsersDBSearchParams['sortBy']>(searchQueries);

        const totalCount = await usersCollection.countDocuments({ $or: [{ login }, { email }] });
        
        const foundUsers = await usersCollection
            .find({ $or: [{ login }, { email }] })
            .sort({ [searchQueries.sortBy]: searchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit)
            .toArray();

        const mappedFoundUsers: UserViewModel[] = foundUsers ? foundUsers.map((user: Required<UserDBModel>) => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        })) : [];

        return {
            pagesCount: 1,
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount: totalCount,
            items: mappedFoundUsers,
        };
    },
};
