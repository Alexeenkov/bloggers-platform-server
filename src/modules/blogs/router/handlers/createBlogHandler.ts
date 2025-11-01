import {Response} from "express";
import type {RequestWithBodyModel} from "@/shared/models";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import type {BlogInputDataModel, BlogOutputDataModel} from "@/modules/blogs/models/blogsModels";
import {blogsService} from "@/modules/blogs/application/blogsService";
import {blogsQueryRepository} from "@/modules/blogs/repository/blogsQueryRepository";

export const createBlogHandler = async (
    req: RequestWithBodyModel<BlogInputDataModel>,
    res: Response<BlogOutputDataModel>,
) => {
    const insertedId: string = await blogsService.create(req.body);

    const createdBlog = await blogsQueryRepository.findById(insertedId);

    res.status(HTTP_STATUSES.CREATED).json(<BlogOutputDataModel>createdBlog);
};