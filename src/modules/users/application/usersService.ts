import {createDateISO} from "../../../shared/utils/createDateISO";
import {usersRepository} from "../repository/usersRepository";
import type {UserInputDataModel, UserModel, UserOutputDataModel} from "../models/usersModels";
import {usersQueryRepository} from "../repository/usersQueryRepository";
import {CustomError} from "../../../shared/utils/CustomError";
import {HTTP_STATUSES} from "../../../shared/constants/httpStatuses";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";

export const usersService = {
    async create(data: UserInputDataModel, isNeedConfirmation: boolean = true): Promise<UserOutputDataModel> {
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
            accountData: {
                login: data.login,
                password: passwordHash,
                email: data.email,
                createdAt: createDateISO(new Date()),
            },
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: createDateISO(add(new Date(), {hours: 1})),
                isConfirmed: !isNeedConfirmation,
            },
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