import {Response} from "express";
import type {RequestWithBodyModel} from "../../../../shared/models";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {PostInputDataModel, PostModel} from "../../models/postsModels";
import {postsService} from "../../application/postsService";
import {postsQueryRepository} from "../../repository/postsQueryRepository";

export const createPostHandler = async (
    req: RequestWithBodyModel<PostInputDataModel>,
    res: Response<PostModel>,
) => {
    const insertedId = await postsService.create(req.body);
    const createdPost = await postsQueryRepository.findById(insertedId);

    res.status(HTTP_STATUSES.CREATED).json(<PostModel>createdPost);
}