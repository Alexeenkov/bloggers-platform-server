import {Response} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {PostInputQueryModel, PostQueryModel, PostsOutputWithPaginationModel} from "@/modules/posts/models/postsModels";
import type {RequestWithQueryParamsModel} from "@/shared/models";
import {withDefaultQueryParams} from "@/modules/posts/features/withDefaultQueryParams";
import {postsQueryRepository} from "@/modules/posts/repository/postsQueryRepository";

export const getPostsListHandler = async (
    req: RequestWithQueryParamsModel<PostInputQueryModel>,
    res: Response<PostsOutputWithPaginationModel>
) => {
    const queryParams: PostQueryModel = withDefaultQueryParams(req.query);

    const postsList: PostsOutputWithPaginationModel = await postsQueryRepository.findMany(queryParams);

    res
        .status(HTTP_STATUSES.OK)
        .json(postsList);
}