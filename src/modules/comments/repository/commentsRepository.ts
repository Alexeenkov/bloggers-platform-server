import {db} from "../../../mongodb/db";
import {CommentDBModel, CommentOutputDataModel, CommentInputDataModel} from "../models/commentsModel";
import {ObjectId, type InsertOneResult, type UpdateResult} from "mongodb";
import {mappingComment} from "../features/mappingComments";

export const commentsRepository = {
    create: async (data: CommentDBModel): Promise<CommentOutputDataModel> => {
        const result: InsertOneResult<CommentDBModel> = await db.comments.insertOne(data);

        return mappingComment({
            ...data,
            _id: result.insertedId
        });
    },

    update: async (commentId: string, comment: CommentInputDataModel): Promise<boolean> => {
        const _id: ObjectId = new ObjectId(commentId);
        const result: UpdateResult<CommentDBModel> = await db.comments.updateOne(
            {_id},
            {
                $set: {
                    content: comment.content,
                    commentatorInfo: comment.commentatorInfo,
                }
            }
        );

        return result.modifiedCount === 1;
    },

    delete: async (commentId: string): Promise<boolean> => {
        const _id: ObjectId = new ObjectId(commentId);
        const result = await db.comments.deleteOne({_id});

        return result.deletedCount === 1;
    },
}