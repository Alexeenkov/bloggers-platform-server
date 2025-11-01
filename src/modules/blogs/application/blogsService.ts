import type {BlogInputDataModel, BlogModel} from "@/modules/blogs/models/blogsModels";
import {createDateISO} from "@/shared/utils/createDateISO";
import {blogsRepository} from "@/modules/blogs/repository/blogsRepository";

export const blogsService = {
    async create(data: BlogInputDataModel): Promise<string> {
        const dateNow = new Date();

        const newBlog: BlogModel = {
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: createDateISO(dateNow),
            isMembership: false,
        };

        return await blogsRepository.create(newBlog);
    },

    async update(id: string, newData: BlogInputDataModel): Promise<boolean> {
        return await blogsRepository.update(id, newData);
    },

    async delete(id: string): Promise<boolean> {
        return await blogsRepository.delete(id);
    },
};