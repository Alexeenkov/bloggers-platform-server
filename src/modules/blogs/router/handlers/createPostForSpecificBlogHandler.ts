import {Response} from "express";
import type {IdPathParamsModel, RequestWithPathParamsAndBodyModel} from "../../../../shared/models";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {PostInputDataForBlogModel} from "../../../posts/models/postsModels";
import {postsService} from "../../../posts/application/postsService";
import type {PostOutputDataModel} from "../../../posts/models/postsModels";

export const createPostForSpecificBlogHandler = async (
    req: RequestWithPathParamsAndBodyModel<IdPathParamsModel, PostInputDataForBlogModel>,
    res: Response<PostOutputDataModel>,
) => {
    const createdPost: PostOutputDataModel = await postsService.create({
        ...req.body,
        blogId: req.params.id,
    });

    res.status(HTTP_STATUSES.CREATED).json(createdPost);
};