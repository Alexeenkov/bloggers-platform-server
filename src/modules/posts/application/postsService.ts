import type {PostInputDataModel, PostModel} from "../models/postsModels";
import {createDateISO} from "../../../shared/utils/createDateISO";
import {postsRepository} from "../repository/postsRepository";
import {blogsQueryRepository} from "../../blogs/repository/blogsQueryRepository";
import {CustomError} from "../../../shared/utils/CustomError";
import {HTTP_STATUSES} from "../../../shared/constants/httpStatuses";

export const postsService = {
    async create(data: PostInputDataModel): Promise<string> {
        const blog = await blogsQueryRepository.findBlogName(data.blogId);

        if (!blog) {
            throw new CustomError('blogId', 'Blog not found', HTTP_STATUSES.NOT_FOUND);
        }

        const newPost: PostModel = {
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: blog.name,
            createdAt: createDateISO(new Date()),
        };

        return await postsRepository.create(newPost);
    },

    async update(id: string, data: PostInputDataModel): Promise<boolean> {
        // Бизнес-правило: пост может быть обновлен только для существующего блога
        const blog = await blogsQueryRepository.findBlogName(data.blogId);

        if (!blog) {
            throw new CustomError('blogId', 'Blog not found', HTTP_STATUSES.NOT_FOUND);
        }

        const isUpdated = await postsRepository.update(id, {
            ...data,
            blogName: blog.name,
        });

        if (!isUpdated) {
            throw new CustomError('id', 'Post not found', HTTP_STATUSES.NOT_FOUND);
        }

        return true;
    },

    async delete(id: string): Promise<boolean> {
        const isDeleted = await postsRepository.delete(id);

        if (!isDeleted) {
            throw new CustomError('id', 'Post not found', HTTP_STATUSES.NOT_FOUND);
        }

        return true;
    },
};