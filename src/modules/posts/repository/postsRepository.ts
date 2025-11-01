import {PostInputDataWithBlogNameModel, PostModel} from "@/modules/posts/models/postsModels";
import {db} from "@/mongodb/db";
import type {InsertOneResult, UpdateResult} from "mongodb";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async create(data: PostModel): Promise<string> {
        const result: InsertOneResult<PostModel> = await db.posts.insertOne(data);

        return result.insertedId.toString();
    },

    async update(id: string, data: PostInputDataWithBlogNameModel): Promise<boolean> {
        const _id: ObjectId = new ObjectId(id);
        const result: UpdateResult<PostModel> = await db.posts.updateOne({_id}, {$set: data});

        return result.matchedCount === 1;
    },

    async delete(id: string): Promise<boolean> {
        const _id: ObjectId = new ObjectId(id);
        const result = await db.posts.deleteOne({_id});

        return result.deletedCount === 1;
    },
};