import {Response} from "express";
import type {RequestWithBodyModel} from "../../../../shared/models";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {PostInputDataModel, PostModel, PostOutputDataModel} from "../../models/postsModels";
import {postsService} from "../../application/postsService";

export const createPostHandler = async (
    req: RequestWithBodyModel<PostInputDataModel>,
    res: Response<PostModel>,
) => {
    const createdPost: PostOutputDataModel = await postsService.create(req.body);

    res.status(HTTP_STATUSES.CREATED).json(createdPost);
}