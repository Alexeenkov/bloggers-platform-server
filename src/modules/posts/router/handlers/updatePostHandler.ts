import type {
    IdPathParamsModel,
    RequestWithPathParamsAndBodyModel,
} from "../../../../shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {PostInputDataModel} from "../../models/postsModels";
import {postsService} from "../../application/postsService";

export const updatePostHandler = async (
    req: RequestWithPathParamsAndBodyModel<IdPathParamsModel, PostInputDataModel>,
    res: Response
) => {
    await postsService.update(req.params.id, req.body);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
}