import type {
    BlogModel,
    BlogOutputDataModel,
    BlogQueryModel,
    BlogsOutputWithPaginationModel,
} from "../models/blogsModels";
import {db} from "../../../mongodb/db";
import type {Filter, WithId} from "mongodb";
import {ObjectId} from "mongodb";
import {mappingBlog} from "../features/mappingBlog";

export const blogsQueryRepository = {
    async findMany(queryParams: BlogQueryModel): Promise<BlogsOutputWithPaginationModel> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
        } = queryParams;

        const skip: number = (pageNumber - 1) * pageSize;
        const filter: Filter<any> = {};

        if (searchNameTerm) {
            filter.name = {$regex: searchNameTerm, $options: 'i'};
        }

        const foundBlogs: WithId<BlogModel>[] = await db.blogs
            .find(filter)
            .sort({[sortBy]: sortDirection})
            .skip(skip)
            .limit(pageSize)
            .toArray();
        const totalBlogsCount: number = await db.blogs.countDocuments(filter);
        const mappedBlogs: BlogOutputDataModel[] = foundBlogs.map((blog: WithId<BlogModel>) => mappingBlog(blog));

        return {
            page: pageNumber,
            pageSize: pageSize,
            pagesCount: Math.ceil(totalBlogsCount / pageSize),
            totalCount: totalBlogsCount,
            items: mappedBlogs,
        };
    },
    async findById(id: string): Promise<BlogOutputDataModel | null> {
        const _id: ObjectId = new ObjectId(id)
        const foundBlog: WithId<BlogModel> | null = await db.blogs.findOne({_id});

        if (!foundBlog) return null;

        return mappingBlog(foundBlog);
    },
    async findBlogName(id: string): Promise<{name: string} | null> {
        const _id: ObjectId = new ObjectId(id);

        return db.blogs.findOne(
            {_id},
            {
                projection: {
                    name: 1,
                    _id: 0,
                }
            },
        );
    },
};