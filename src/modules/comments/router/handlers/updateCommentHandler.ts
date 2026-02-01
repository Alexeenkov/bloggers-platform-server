import {RequestWithPathParamsAndBodyModel} from "../../../../shared/models";
import {IdPathParamsModel} from "../../../../shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {commentsService} from "../../application/commentsService";
import {CommentInputDataModel} from "../../models/commentsModel";
import {usersQueryRepository} from "../../../users/repository/usersQueryRepository";
import {commentsQueryRepository} from "../../repository/commentsQueryRepository";

export const updateCommentHandler = async (req: RequestWithPathParamsAndBodyModel<IdPathParamsModel, CommentInputDataModel>, res: Response<void>) => {
    const {userId} = req;

    if (!userId) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return;
    }

    const commentatorInfo = await usersQueryRepository.findById(userId);

    if (!commentatorInfo) {
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

    const isUpdated = await commentsService.update(req.params.id, {
        content: req.body.content,
        commentatorInfo: {
            userId: commentatorInfo.id,
            userLogin: commentatorInfo.login,
        },
    });

    if (!isUpdated) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};