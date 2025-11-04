import type {BlogInputDataModel, BlogModel} from "../models/blogsModels";
import {db} from "../../../mongodb/db";
import type {InsertOneResult} from "mongodb";
import {ObjectId} from "mongodb";
import {mappingBlog} from "../features/mappingBlog";
import type {BlogOutputDataModel} from "../models/blogsModels";

export const blogsRepository = {
    async create(data: BlogModel): Promise<BlogOutputDataModel> {
        const result: InsertOneResult<BlogModel> = await db.blogs.insertOne(data);

        return mappingBlog({
            ...data,
            _id: result.insertedId
        });
    },
    async update(id: string, newData: BlogInputDataModel): Promise<boolean> {
        const _id: ObjectId = new ObjectId(id);
        const result = await db.blogs.updateOne({_id}, {$set: newData});

        return result.matchedCount === 1;
    },
    async delete(id: string): Promise<boolean> {
        const _id: ObjectId = new ObjectId(id);
        const result = await db.blogs.deleteOne({_id});

        return result.deletedCount === 1;
    },
};