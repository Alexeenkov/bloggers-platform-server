import {RequestWithPathParamsModel} from "../../../../shared/models";
import {IdPathParamsModel} from "../../../../shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {commentsService} from "../../application/commentsService";
import {commentsQueryRepository} from "../../repository/commentsQueryRepository";

export const deleteCommentHandler = async (req: RequestWithPathParamsModel<IdPathParamsModel>, res: Response<void>) => {
    const {userId} = req;

    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    const comment = await commentsQueryRepository.findById(req.params.id);

    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    if (comment.commentatorInfo.userId !== userId) {
        res.sendStatus(HTTP_STATUSES.FORBIDDEN);

        return;
    }

    const isDeleted = await commentsService.delete(req.params.id);

    if (!isDeleted) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};