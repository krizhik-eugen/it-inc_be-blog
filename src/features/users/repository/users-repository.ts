import { UserDBModel, UsersModel } from '../model';

export class UsersRepository {
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await UsersModel.findOne()
            .or([
                { 'accountData.login': loginOrEmail },
                { 'accountData.email': loginOrEmail },
            ])
            .lean();
    }

    async findUserById(id: string) {
        return await UsersModel.findById(id).lean();
    }

    async findUserByConfirmationCode(code: string) {
        return await UsersModel.findOne({
            'emailConfirmation.confirmationCode': code,
        }).lean();
    }

    async findUserByRecoveryCode(recoveryCode: string) {
        return await UsersModel.findOne({
            'passwordRecovery.recoveryCode': recoveryCode,
        }).lean();
    }

    async addNewUser(newUser: UserDBModel) {
        const result = await UsersModel.create(newUser);
        return result.id;
    }

    async updateUser(updatedUser: Partial<UserDBModel & { id: string }>) {
        const { id, ...userToUpdate } = updatedUser;
        const result = await UsersModel.findByIdAndUpdate(id, userToUpdate, {
            new: true,
        }).lean();
        return result;
    }

    async deleteUser(id: string) {
        const result = await UsersModel.findByIdAndDelete(id).lean();
        return result;
    }

    async clearUsers() {
        const result = await UsersModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
