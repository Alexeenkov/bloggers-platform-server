import type {WithId} from "mongodb";
import type {CommentDBModel, CommentOutputDataModel} from "../models/commentsModel";

export const mappingComment = (comment: WithId<CommentDBModel>): CommentOutputDataModel => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
    };
}

export const mappingComments = (comments: WithId<CommentDBModel>[]): CommentOutputDataModel[] => {
    return comments.map(mappingComment);
}