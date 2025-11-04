import {CommentDBModel, CommentOutputDataModel} from "../models/commentsModel";

export const mappingComment = (comment: CommentDBModel): CommentOutputDataModel => {
    return {
        id: comment._id,
        content: comment.content,
        commentatorInfo: comment.commentatorInfo,
        createdAt: comment.createdAt,
    };
}

export const mappingComments = (comments: CommentDBModel[]): CommentOutputDataModel[] => {
    return comments.map(mappingComment);
}