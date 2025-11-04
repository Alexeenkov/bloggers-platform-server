import {Response} from "express";
import type {RequestWithBodyModel} from "../../../../shared/models";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";
import type {BlogInputDataModel, BlogOutputDataModel} from "../../models/blogsModels";
import {blogsService} from "../../application/blogsService";

export const createBlogHandler = async (
    req: RequestWithBodyModel<BlogInputDataModel>,
    res: Response<BlogOutputDataModel>,
) => {
    const createdBlog: BlogOutputDataModel = await blogsService.create(req.body);

    res.status(HTTP_STATUSES.CREATED).json(createdBlog);
};