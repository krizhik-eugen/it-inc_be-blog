import { UserDBModel, UsersModel } from '../model';

export const usersRepository = {
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await UsersModel.findOne().or([
            { 'accountData.login': loginOrEmail },
            { 'accountData.email': loginOrEmail },
        ]);
    },

    async findUserById(id: string) {
        return await UsersModel.findById(id);
    },

    async findUserByConfirmationCode(code: string) {
        return await UsersModel.findOne({
            'emailConfirmation.confirmationCode': code,
        });
    },

    async addNewUser(newUser: UserDBModel) {
        const result = await UsersModel.create(newUser);
        return result.id;
    },

    async updateUser(updatedUser: Partial<UserDBModel & { id: string }>) {
        const { id, ...userToUpdate } = updatedUser;
        const result = await UsersModel.findByIdAndUpdate(id, userToUpdate, {
            new: true,
        });
        return result;
    },

    async deleteUser(id: string) {
        const result = await UsersModel.findByIdAndDelete(id);
        return result;
    },

    async clearUsers() {
        const result = await UsersModel.deleteMany({});
        return result.deletedCount || 0;
    },
};
