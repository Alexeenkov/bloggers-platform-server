import {db} from "../../../mongodb/db";
import type {InsertOneResult} from "mongodb";
import {ObjectId} from "mongodb";
import type {UserModel} from "../models/usersModels";

export const usersRepository = {
    async create(data: UserModel): Promise<string> {
        const result: InsertOneResult = await db.users.insertOne(data);

        return result.insertedId.toString();
    },
    async delete(id: string): Promise<boolean> {
        const _id: ObjectId = new ObjectId(id);
        const result = await db.users.deleteOne({_id});

        return result.deletedCount === 1;
    },
};