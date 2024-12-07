import { usersCollection, UserDBModel } from '../model';

export const usersRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return usersCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
        });
    },

    async findUserById(_id: UserDBModel['_id']) {
        return await usersCollection.findOne({ _id });
    },

    async addNewUser(newUser: UserDBModel) {
        const result = await usersCollection.insertOne(newUser);
        return result.insertedId.toString();
    },

    async deleteUser(_id: UserDBModel['_id']) {
        const result = await usersCollection.deleteOne({ _id });
        return result.deletedCount > 0;
    },

    async setUsers(users: Omit<UserDBModel, '_id' | 'createdAt'>[]) {
        if (users.length > 0) {
            const mappedUsers = users.map((user) => {
                return {
                    ...user,
                    createdAt: new Date().toISOString(),
                };
            });
            await usersCollection.insertMany(mappedUsers);
            return;
        }
        await usersCollection.deleteMany({});
    },
};
