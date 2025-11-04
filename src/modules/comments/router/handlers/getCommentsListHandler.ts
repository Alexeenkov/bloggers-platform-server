import {RequestWithQueryParamsModel} from "../../../../shared/models";
import {CommentInputQueryModel, CommentQueryModel} from "../../models/commentsModel";
import {commentsQueryRepository} from "../../repository/commentsQueryRepository";
import {Response} from "express";
import {CommentsOutputWithPaginationModel} from "../../models/commentsModel";
import {withDefaultQueryParams} from "../../features/withDefaultQueryParams";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";

export const getCommentsListHandler = async (
    req: RequestWithQueryParamsModel<CommentInputQueryModel>,
    res: Response<CommentsOutputWithPaginationModel>
) => {
    const queryParams: CommentQueryModel = withDefaultQueryParams(req.query);

    const comments = await commentsQueryRepository.findMany(req.params.id, queryParams);

    res.status(HTTP_STATUSES.OK).json(comments);
};