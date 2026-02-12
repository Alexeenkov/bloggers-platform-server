import {db} from "../../../mongodb/db";
import {Filter, ObjectId, WithId} from "mongodb";
import {mappingUser} from "../features/mappingUser";
import type {
    UserModel,
    UserOutputDataModel,
    UsersOutputWithPaginationModel,
    UsersQueryModel,
} from "../models/usersModels";

export const usersQueryRepository = {
    async findMany(queryParams: UsersQueryModel): Promise<UsersOutputWithPaginationModel> {
        const {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber,
            searchLoginTerm,
            searchEmailTerm,
        } = queryParams;

        const filter: Filter<any> = {};
        const skip: number = (pageNumber - 1) * pageSize;

        if (searchLoginTerm && searchEmailTerm) {
            filter.$or = [
                {'accountData.login': {$regex: searchLoginTerm, $options: 'i'}},
                {'accountData.email': {$regex: searchEmailTerm, $options: 'i'}},
            ];
        } else if (searchLoginTerm) {
            filter['accountData.login'] = {$regex: searchLoginTerm, $options: 'i'};
        } else if (searchEmailTerm) {
            filter['accountData.email'] = {$regex: searchEmailTerm, $options: 'i'};
        }

        const foundUsers = await db.users.find(filter)
            .sort({[`accountData.${sortBy}`]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalUsersCount: number = await db.users.countDocuments(filter);
        const mappedUsers: UserOutputDataModel[] = foundUsers.map((user: WithId<UserModel>) => mappingUser(user));

        return {
            page: pageNumber,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalUsersCount / pageSize),
            totalCount: totalUsersCount,
            items: mappedUsers,
        };
    },

    async findById(id: string): Promise<UserOutputDataModel | null> {
        const _id: ObjectId = new ObjectId(id);
        const foundUser: WithId<UserModel> | null = await db.users.findOne({_id});

        if (!foundUser) return null;

        return mappingUser(foundUser);
    },

    async findByLoginOrEmail(login: string, email: string): Promise<UserOutputDataModel | null> {
        const foundUser = await db.users.findOne({
            $or: [
                {'accountData.login': login},
                {'accountData.email': email},
            ],
        });

        if (!foundUser) {
            return null;
        }

        return mappingUser(foundUser);
    },
};