import {Response} from "express";
import type {IdPathParamsModel, RequestWithPathParamsAndBodyModel} from "@/shared/models";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {PostInputDataForBlogModel, PostModel} from "@/modules/posts/models/postsModels";
import {postsService} from "@/modules/posts/application/postsService";
import {postsQueryRepository} from "@/modules/posts/repository/postsQueryRepository";

export const createPostForSpecificBlogHandler = async (
    req: RequestWithPathParamsAndBodyModel<IdPathParamsModel, PostInputDataForBlogModel>,
    res: Response<PostModel>,
) => {
    const insertedId = await postsService.create({
        ...req.body,
        blogId: req.params.id,
    });

    const createdPost = await postsQueryRepository.findById(insertedId);

    res.status(HTTP_STATUSES.CREATED).json(<PostModel>createdPost);
};