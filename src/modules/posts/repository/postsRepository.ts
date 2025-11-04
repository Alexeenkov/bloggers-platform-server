import {PostInputDataWithBlogNameModel, PostModel} from "../models/postsModels";
import {db} from "../../../mongodb/db";
import type {InsertOneResult, UpdateResult} from "mongodb";
import {ObjectId} from "mongodb";
import {mappingPost} from "../features/mappingPost";
import type {PostOutputDataModel} from "../models/postsModels";

export const postsRepository = {
    async create(data: PostModel): Promise<PostOutputDataModel> {
        const result: InsertOneResult<PostModel> = await db.posts.insertOne(data);

        return mappingPost({
            ...data,
            _id: result.insertedId
        });
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