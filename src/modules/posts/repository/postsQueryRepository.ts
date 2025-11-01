import {
    PostModel,
    PostOutputDataModel,
    PostQueryModel,
    PostsOutputWithPaginationModel
} from "@/modules/posts/models/postsModels";
import {db} from "@/mongodb/db";
import type {Filter, WithId} from "mongodb";
import {ObjectId} from "mongodb";
import {mappingPost} from "@/modules/posts/features/mappingPost";

export const postsQueryRepository = {
    async findMany(queryParams: PostQueryModel, blogId?: string): Promise<PostsOutputWithPaginationModel> {
        const {
            sortBy,
            sortDirection,
            pageSize,
            pageNumber,
        } = queryParams;

        const filter: Filter<any> = {};
        const skip: number = (pageNumber - 1) * pageSize;

        if (blogId) {
            filter.blogId = blogId;
        }

        const foundPosts = await db.posts.find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalPostsCount: number = await db.posts.countDocuments(filter);
        const mappedPosts: PostOutputDataModel[] = foundPosts.map((post: WithId<PostModel>) => mappingPost(post));

        return {
            page: pageNumber,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalPostsCount / pageSize),
            totalCount: totalPostsCount,
            items: mappedPosts,
        };
    },
    async findById(id: string): Promise<PostOutputDataModel | null> {
        const _id: ObjectId = new ObjectId(id);
        const foundPost = await db.posts.findOne({_id});

        if (!foundPost) return null;

        return mappingPost(foundPost);
    },
};