import {RequestWithPathParamsAndBodyModel} from "../../../../shared/models";
import {CommentInputDataModel, CommentOutputDataModel} from "../../../comments/models/commentsModel";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import {commentsService} from "../../../comments/application/commentsService";
import {IdPathParamsModel} from "../../../../shared/models";
import {usersQueryRepository} from "../../../users/repository/usersQueryRepository";
import {postsQueryRepository} from "../../repository/postsQueryRepository";

export const createCommentForSpecificPostHandler = async (
    req: RequestWithPathParamsAndBodyModel<IdPathParamsModel, CommentInputDataModel>,
    res: Response<CommentOutputDataModel>,
) => {
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

    const post = await postsQueryRepository.findById(req.params.id);

    if (!post) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    const comment = await commentsService.create(req.params.id, {
        content: req.body.content,
        commentatorInfo: {
            userId: commentatorInfo.id,
            userLogin: commentatorInfo.login,
        },
    });

    res.status(HTTP_STATUSES.CREATED).json(comment);
};