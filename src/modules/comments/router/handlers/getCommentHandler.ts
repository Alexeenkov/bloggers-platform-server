import {RequestWithPathParamsModel} from "../../../../shared/models";
import {CommentOutputDataModel} from "../../models/commentsModel";
import {IdPathParamsModel} from "../../../../shared/models";
import {commentsQueryRepository} from "../../repository/commentsQueryRepository";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";

export const getCommentByIdHandler = async (req: RequestWithPathParamsModel<IdPathParamsModel>, res: Response<CommentOutputDataModel>) => {
    const comment = await commentsQueryRepository.findById(req.params.id);

    if (!comment) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    res.status(HTTP_STATUSES.OK).json(comment);
};