import type {WithId} from "mongodb";
import type {PostModel, PostOutputDataModel} from "@/modules/posts/models/postsModels";

export const mappingPost = (post: WithId<PostModel>): PostOutputDataModel => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    }
};