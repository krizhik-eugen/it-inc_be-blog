import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { TCreateUserDTO, TUser, TUserModel, UserDocument } from './types';
import { userEmailValidation, userLoginValidation } from './settings';
import { getCodeExpirationDate } from '../../../app/configs/app-config';

const userSchema = new Schema<TUser>({
    accountData: {
        login: {
            type: String,
            unique: true,
            required: true,
            minlength: userLoginValidation.minLength,
            maxlength: userLoginValidation.maxLength,
            validate: {
                validator: (value: string) =>
                    userLoginValidation.pattern.test(value),
                message: userLoginValidation.errorMessagePattern,
            },
        },
        email: {
            type: String,
            unique: true,
            required: true,
            validate: {
                validator: (value: string) =>
                    userEmailValidation.pattern.test(value),
                message: userEmailValidation.errorMessagePattern,
            },
        },
        passwordHash: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: String,
        default: () => new Date().toISOString(),
    },
    emailConfirmation: {
        confirmationCode: {
            type: String,
            default: '',
        },
        expirationDate: {
            type: Date,
            default: '',
        },
        isConfirmed: {
            type: Boolean,
            default: false,
        },
    },
    passwordRecovery: {
        recoveryCode: {
            type: String,
            default: null,
        },
        expirationDate: {
            type: Date,
            default: null,
        },
    },
});

export const userStatics = {
    createNewUser(dto: TCreateUserDTO) {
        const newUser = new UserModel({ accountData: dto });
        newUser.emailConfirmation.confirmationCode = uuidv4();
        newUser.emailConfirmation.expirationDate = getCodeExpirationDate();
        return newUser;
    },
    createNewConfirmedUser(dto: TCreateUserDTO) {
        const newUser = new UserModel({ accountData: dto });
        newUser.emailConfirmation.isConfirmed = true;
        return newUser;
    },
};

export const userMethods = {
    confirmUserEmail(code: string) {
        const that = this as UserDocument;
        let error = '';
        if (that.emailConfirmation.isConfirmed) {
            error = 'Code already confirmed';
        }
        if (
            that.emailConfirmation.expirationDate &&
            that.emailConfirmation.expirationDate < new Date()
        ) {
            error = 'Confirmation code expired';
        }
        if (that.emailConfirmation.confirmationCode !== code) {
            error = 'Invalid code';
        }

        that.emailConfirmation.isConfirmed = true;
        return { error };
    },

    updateConfirmationCode() {
        const that = this as UserDocument;
        let error = '';
        if (that.emailConfirmation.isConfirmed) {
            error = 'Email already confirmed';
        }

        that.emailConfirmation.confirmationCode = uuidv4();
        that.emailConfirmation.expirationDate = getCodeExpirationDate();

        return { error };
    },

    createPasswordRecoveryCode() {
        const that = this as UserDocument;
        that.passwordRecovery.recoveryCode = uuidv4();
        that.passwordRecovery.expirationDate = getCodeExpirationDate();
        return that.passwordRecovery.recoveryCode;
    },

    changePasswordWithRecoveryCode(recoveryCode: string, passwordHash: string) {
        const that = this as UserDocument;
        let error = '';

        if (recoveryCode !== that.passwordRecovery.recoveryCode) {
            error = 'Recovery code is not correct';
        }
        if (
            that.passwordRecovery.expirationDate &&
            that.passwordRecovery.expirationDate < new Date()
        ) {
            error = 'Recovery code expired';
        }

        that.accountData.passwordHash = passwordHash;
        that.passwordRecovery.recoveryCode = '';
        that.passwordRecovery.expirationDate = null;

        return { error };
    },
};

userSchema.statics = userStatics;
userSchema.methods = userMethods;

export const UserModel = model<TUser, TUserModel>('users', userSchema);
