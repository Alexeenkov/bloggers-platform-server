import {db} from "../../../mongodb/db";
import {CommentDBModel, CommentOutputDataModel, CommentInputDataModel} from "../models/commentsModel";
import {ObjectId} from "mongodb";
import {createDateISO} from "../../../shared/utils/createDateISO";
import {UpdateResult} from "mongodb";
import {mappingComment} from "../features/mappingComments";

export const commentsRepository = {
    create: async (postId: string, comment: CommentInputDataModel): Promise<CommentOutputDataModel> => {
        const commentId = new ObjectId().toString();

        const newComment: CommentDBModel = {
            _id: commentId,
            postId,
            ...comment,
            createdAt: createDateISO(new Date()),
        };

        await db.comments.insertOne(newComment);

        return mappingComment(newComment);
    },

    update: async (commentId: string, comment: CommentInputDataModel): Promise<boolean> => {
        const result: UpdateResult<CommentDBModel> = await db.comments.updateOne(
            {_id: commentId},
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
        const result = await db.comments.deleteOne({_id: commentId});

        return result.deletedCount === 1;
    },
}