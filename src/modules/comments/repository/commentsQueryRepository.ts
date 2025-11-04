import {db} from "../../../mongodb/db";
import {
    CommentDBModel,
    CommentOutputDataModel,
    CommentQueryModel,
    CommentsOutputWithPaginationModel
} from "../models/commentsModel";
import {type WithId, ObjectId} from "mongodb";
import {mappingComment, mappingComments} from "../features/mappingComments";

export const commentsQueryRepository = {
    async findMany(postId: string, queryParams: CommentQueryModel): Promise<CommentsOutputWithPaginationModel> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
        } = queryParams;

        const skip: number = (pageNumber - 1) * pageSize;
        const filter = {postId};

        const foundComments: WithId<CommentDBModel>[] = await db.comments
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const totalCommentsCount: number = await db.comments.countDocuments(filter);
        const mappedComments: CommentOutputDataModel[] = mappingComments(foundComments);

        return {
            page: pageNumber,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalCommentsCount / pageSize),
            totalCount: totalCommentsCount,
            items: mappedComments,
        };
    },

    async findById(id: string): Promise<CommentOutputDataModel | null> {
        const _id: ObjectId = new ObjectId(id);
        const comment: WithId<CommentDBModel> | null = await db.comments.findOne({_id});

        if (!comment) return null;

        return mappingComment(comment);
    },
}