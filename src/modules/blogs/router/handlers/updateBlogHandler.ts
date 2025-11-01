import type {
    IdPathParamsModel,
    RequestWithPathParamsAndBodyModel,
} from "@/shared/models";
import {Response} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import {blogsRepository} from "@/modules/blogs/repository/blogsRepository";
import type {BlogInputDataModel} from "@/modules/blogs/models/blogsModels";

export const updateBlogHandler = async (
    req: RequestWithPathParamsAndBodyModel<IdPathParamsModel,
        BlogInputDataModel>, res: Response,
) => {
    const isUpdated: boolean = await blogsRepository.update(req.params.id, req.body);

    if (!isUpdated) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND);

        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
};