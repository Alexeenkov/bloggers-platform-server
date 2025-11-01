import type {IdPathParamsModel, RequestWithPathParamsModel} from "@/shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import {postsService} from "@/modules/posts/application/postsService";

export const deletePostHandler = async (
    req: RequestWithPathParamsModel<IdPathParamsModel>,
    res: Response,
) => {
    await postsService.delete(req.params.id);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};