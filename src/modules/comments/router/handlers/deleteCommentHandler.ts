import {RequestWithPathParamsModel} from "../../../../shared/models";
import {IdPathParamsModel} from "../../../../shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {commentsService} from "../../application/commentsService";

export const deleteCommentHandler = async (req: RequestWithPathParamsModel<IdPathParamsModel>, res: Response<void>) => {
    const isDeleted = await commentsService.delete(req.params.id);

    if (!isDeleted) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};