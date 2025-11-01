import type {WithId} from "mongodb";
import type {BlogModel, BlogOutputDataModel} from "@/modules/blogs/models/blogsModels";

export const mappingBlog = (blog: WithId<BlogModel>): BlogOutputDataModel => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
};
