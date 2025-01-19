import { injectable } from 'inversify';
import { UserModel } from '../domain/user-entity';
import { UserDocument } from '../domain/types';

@injectable()
export class UsersRepository {
    async findUserByLoginOrEmail(loginOrEmail: string) {
        return await UserModel.findOne().or([
            { 'accountData.login': loginOrEmail },
            { 'accountData.email': loginOrEmail },
        ]);
    }

    async findUserById(id: string) {
        return await UserModel.findById(id);
    }

    async findUserByConfirmationCode(code: string) {
        return await UserModel.findOne({
            'emailConfirmation.confirmationCode': code,
        });
    }

    async findUserByRecoveryCode(recoveryCode: string) {
        return await UserModel.findOne({
            'passwordRecovery.recoveryCode': recoveryCode,
        });
    }

    async save(user: UserDocument) {
        return await user.save();
    }

    async deleteUserById(id: string) {
        const result = await UserModel.deleteOne({ _id: id });
        return result.deletedCount || 0;
    }

    async deleteAllUsers() {
        const result = await UserModel.deleteMany({});
        return result.deletedCount || 0;
    }
}
