import {RequestWithPathParamsAndBodyModel} from "../../../../shared/models";
import {IdPathParamsModel} from "../../../../shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {commentsService} from "../../application/commentsService";
import {CommentInputDataModel} from "../../models/commentsModel";

export const updateCommentHandler = async (req: RequestWithPathParamsAndBodyModel<IdPathParamsModel, CommentInputDataModel>, res: Response<void>) => {
    const isUpdated = await commentsService.update(req.params.id, req.body);

    if (!isUpdated) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};