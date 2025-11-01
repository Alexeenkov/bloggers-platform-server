import {createDateISO} from "@/shared/utils/createDateISO";
import {usersRepository} from "@/modules/users/repository/usersRepository";
import type {UserInputDataModel, UserModel, UserOutputDataModel} from "@/modules/users/models/usersModels";
import {usersQueryRepository} from "@/modules/users/repository/usersQueryRepository";
import {CustomError} from "@/shared/utils/CustomError";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import bcrypt from "bcrypt";

export const usersService = {
    async create(data: UserInputDataModel): Promise<string> {
        const foundUser: UserOutputDataModel | null = await usersQueryRepository.findByLoginOrEmail(
            data.login,
            data.email,
        );

        if (foundUser && foundUser.login === data.login) {
            throw new CustomError('login', `Login ${data.login} already exists`, HTTP_STATUSES.BAD_REQUEST);
        }

        if (foundUser && foundUser.email === data.email) {
            throw new CustomError('email', `Email ${data.email} already exists`, HTTP_STATUSES.BAD_REQUEST);
        }

        const passwordHash: string = await this._generateHash(data.password);

        const newUser: UserModel = {
            login: data.login,
            password: passwordHash,
            email: data.email,
            createdAt: createDateISO(new Date()),
        };

        return await usersRepository.create(newUser);
    },

    async delete(id: string): Promise<boolean> {
        return await usersRepository.delete(id);
    },

    async _generateHash(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt(10);

        return bcrypt.hash(password, salt);
    }
};