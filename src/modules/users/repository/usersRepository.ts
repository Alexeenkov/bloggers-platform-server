import {db} from "../../../mongodb/db";
import type {InsertOneResult} from "mongodb";
import {ObjectId} from "mongodb";
import type {UserModel} from "../models/usersModels";
import {mappingUser} from "../features/mappingUser";
import type {UserOutputDataModel} from "../models/usersModels";

export const usersRepository = {
    async create(data: UserModel): Promise<UserOutputDataModel> {
        const result: InsertOneResult<UserModel> = await db.users.insertOne(data);

        return mappingUser({
            ...data,
            _id: result.insertedId
        });
    },
    async delete(id: string): Promise<boolean> {
        const _id: ObjectId = new ObjectId(id);
        const result = await db.users.deleteOne({_id});

        return result.deletedCount === 1;
    },
};