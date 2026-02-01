import {CommentInputQueryModel, CommentQueryModel, CommentsOutputWithPaginationModel} from "../../../comments/models/commentsModel";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {commentsQueryRepository} from "../../../comments/repository/commentsQueryRepository";
import {IdPathParamsModel} from "../../../../shared/models";
import {RequestWithPathAndQueryParamsModel} from "../../../../shared/models";
import {withDefaultQueryParams} from "../../../comments/features/withDefaultQueryParams";
import {postsQueryRepository} from "../../repository/postsQueryRepository";

export const getCommentsForSpecificPostHandler = async (
    req: RequestWithPathAndQueryParamsModel<IdPathParamsModel, CommentInputQueryModel>,
    res: Response<CommentsOutputWithPaginationModel>,
) => {
    const post = await postsQueryRepository.findById(req.params.id);

    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    const queryParams: CommentQueryModel = withDefaultQueryParams(req.query);

    const comments = await commentsQueryRepository.findMany(req.params.id, queryParams);

    res.status(HTTP_STATUSES.OK).json(comments);
};