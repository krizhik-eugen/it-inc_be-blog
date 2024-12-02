import { ObjectId } from 'mongodb';
import { blogsRepository } from '../../blogs';
import { usersCollection, UsersDBModel } from '../model';
import { AllUsersResponseModel, GetAllUsersRequest, TUser } from '../types';
import { TDBSearchParams } from '../../types';

export const usersRepository = {

    async findUserByLoginOrEmail({login, email}: {login: string, email: string}) {
        return usersCollection.findOne({ $or: [{ login }, { email }] });
    },

    async findUserById(_id: string) {
        return usersCollection.findOne({ _id: new ObjectId(_id) });
    },

    //  async getUsers(req: GetAllUsersRequest): Promise<AllUsersResponseModel> {
    //     const { searchLoginTerm: login, searchEmailTerm: email, ...restQueries } = req.query;
    //     const searchQueries = getSearchQueries(restQueries);
    //     const dbSearchQueries = getDBSearchQueries(searchQueries);

    //     const totalCount = await usersCollection.countDocuments({ $or: [{ login }, { email }] });
        
    //     const foundUsers = await usersCollection
    //         .find({ $or: [{ login }, { email }] })
    //         .sort({ [searchQueries.sortBy]: searchQueries.sortDirection })
    //         .skip(dbSearchQueries.skip)
    //         .limit(dbSearchQueries.limit)
    //         .toArray();

    //     const mappedFoundUsers: UserViewModel[] = foundUsers.map((user: UsersDBModel) => ({
    //         id: user._id.toString(),
    //         login: user.login,
    //         email: user.email,
    //         createdAt: user.createdAt,
    //     }))

    //     return {
    //         pagesCount: 1,
    //         page: searchQueries.pageNumber,
    //         pageSize: searchQueries.pageSize,
    //         totalCount: totalCount,
    //         items: mappedFoundUsers,
    //     };
    // },

    async addNewUser(newUser: UsersDBModel) {
        const result = await usersCollection.insertOne(newUser);
        return result.insertedId.toString();
    },

    // async getUser(id: TUser['id']) {
    //     const foundUser = await usersCollection.findOne({
    //         _id: new ObjectId(id),
    //     });
    //     if (!foundUser) return undefined;
    //     const { _id, ...foundUserWithoutId } = foundUser;
    //     return { ...foundUserWithoutId, id: _id.toString() };
    // },

    // async deleteUser(id: TUser['id']) {
    //     const _id = new ObjectId(id);
    //     const result = await usersCollection.deleteOne({ _id });
    //     return result.deletedCount > 0;
    // },

    // async setUsers(users: Omit<TUser, 'createdAt' | 'blogName' | 'id'>[]) {
    //     if (users.length > 0) {
    //         const mappedUsers = await users.reduce<Promise<TUserInstance[]>>(
    //             async (accPromise, post) => {
    //                 const acc = await accPromise; // Wait for accumulated results
    //                 const blog = await blogsRepository.getBlog(post.blogId);
    //                 if (!blog) {
    //                     return acc; // Skip adding if blog is undefined
    //                 }
    //                 acc.push({
    //                     ...post,
    //                     blogName: blog.name,
    //                     createdAt: new Date().toISOString(),
    //                 });
    //                 return acc;
    //             },
    //             Promise.resolve([])
    //         );
    //         await usersCollection.insertMany(mappedUsers);
    //         return;
    //     }
    //     await usersCollection.deleteMany({});
    // },
};
