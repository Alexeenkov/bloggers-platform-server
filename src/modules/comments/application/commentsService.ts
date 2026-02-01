import {CommentInputDataModel, CommentOutputDataModel, CommentDBModel, CommentModel} from "../models/commentsModel";
import {commentsRepository} from "../repository/commentsRepository";
import {createDateISO} from "../../../shared/utils/createDateISO";

export const commentsService = {
    async create(postId: string, data: Omit<CommentModel, 'createdAt'>): Promise<CommentOutputDataModel> {
        const newComment: CommentDBModel = {
            postId,
            content: data.content,
            commentatorInfo: data.commentatorInfo,
            createdAt: createDateISO(new Date()),
        };

        return await commentsRepository.create(newComment);
    },

    async update(id: string, data: CommentInputDataModel): Promise<boolean> {
        return await commentsRepository.update(id, data);
    },

    async delete(id: string): Promise<boolean> {
        return await commentsRepository.delete(id);
    }
}