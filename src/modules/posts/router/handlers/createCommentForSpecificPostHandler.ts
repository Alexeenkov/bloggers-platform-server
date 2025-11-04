import {RequestWithPathParamsAndBodyModel} from "../../../../shared/models";
import {CommentInputDataModel, CommentOutputDataModel} from "../../../comments/models/commentsModel";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {commentsService} from "../../../comments/application/commentsService";
import {IdPathParamsModel} from "../../../../shared/models";

export const createCommentForSpecificPostHandler = async (
    req: RequestWithPathParamsAndBodyModel<IdPathParamsModel, CommentInputDataModel>,
    res: Response<CommentOutputDataModel>,
) => {
    const comment = await commentsService.create(req.params.id, req.body);

    res.status(HTTP_STATUSES.CREATED).json(comment);
};