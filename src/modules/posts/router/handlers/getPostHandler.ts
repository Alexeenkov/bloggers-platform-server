import type {IdPathParamsModel, RequestWithPathParamsModel} from "@/shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {PostModel} from "@/modules/posts/models/postsModels";
import {postsQueryRepository} from "@/modules/posts/repository/postsQueryRepository";

export const getPostHandler = async (
    req: RequestWithPathParamsModel<IdPathParamsModel>,
    res: Response<PostModel>,
) => {
    const foundPost: PostModel | null = await postsQueryRepository.findById(req.params.id);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    res
        .status(HTTP_STATUSES.OK)
        .json(foundPost);
}