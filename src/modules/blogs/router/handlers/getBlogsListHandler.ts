import {Response} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {BlogsOutputWithPaginationModel, BlogInputQueryModel, BlogQueryModel} from "@/modules/blogs/models/blogsModels";
import type {RequestWithQueryParamsModel} from "@/shared/models";
import {withDefaultQueryParams} from "@/modules/blogs/features/withDefaultQueryParams";
import {blogsQueryRepository} from "@/modules/blogs/repository/blogsQueryRepository";

export const getBlogsListHandler = async (
    req: RequestWithQueryParamsModel<BlogInputQueryModel>,
    res: Response<BlogsOutputWithPaginationModel>
) => {
    const queryParams: BlogQueryModel = withDefaultQueryParams(req.query);

    const blogsList: BlogsOutputWithPaginationModel = await blogsQueryRepository.findMany(queryParams);

    res
        .status(HTTP_STATUSES.OK)
        .json(blogsList);
};