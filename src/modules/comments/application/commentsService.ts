import {CommentInputDataModel, CommentOutputDataModel, CommentDBModel} from "../models/commentsModel";
import {commentsRepository} from "../repository/commentsRepository";
import {createDateISO} from "../../../shared/utils/createDateISO";

export const commentsService = {
    async create(postId: string, data: CommentInputDataModel): Promise<CommentOutputDataModel> {
        const newComment: CommentDBModel = {
            postId,
            content: data.content,
            commentatorInfo: data.commentatorInfo,
            createdAt: createDateISO(new Date()),
        };

        return await commentsRepository.create(newComment);
    },

    async updateComment(id: string, data: CommentInputDataModel): Promise<boolean> {
        return await commentsRepository.update(id, data);
    },

    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.delete(id);
    }
}