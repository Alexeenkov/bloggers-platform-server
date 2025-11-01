import type {IdPathParamsModel, RequestWithPathParamsModel} from "@/shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {BlogOutputDataModel} from "@/modules/blogs/models/blogsModels";
import {blogsQueryRepository} from "@/modules/blogs/repository/blogsQueryRepository";

export const getBlogHandler = async (
    req: RequestWithPathParamsModel<IdPathParamsModel>,
    res: Response<BlogOutputDataModel>,
) => {
    const foundBlog: BlogOutputDataModel | null = await blogsQueryRepository.findById(req.params.id);

    if (!foundBlog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    res
        .status(HTTP_STATUSES.OK)
        .json(foundBlog);
};