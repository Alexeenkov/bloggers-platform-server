// @ts-ignore
import {Express} from "express";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
import {postsTestManager} from "../utils/testManagers/postsTestManager";
import {blogsTestManager} from "../utils/testManagers/blogsTestManager";
import type {BlogInputDataModel, BlogOutputDataModel} from "@/modules/blogs/models/blogsModels";
import type {PostInputDataModel, PostOutputDataModel} from "@/modules/posts/models/postsModels";
import {REGEXPS} from "@/shared/constants/regexps";
import {runAppForTests} from "../utils/runAppForTests";
import {POSTS_ROUTER_PATH} from "@/shared/constants/routersPaths";

describe(POSTS_ROUTER_PATH, () => {
    const app: Express = runAppForTests();
    const {createNewBlog} = blogsTestManager(app);
    const {
        getAllPosts,
        getPostById,
        createNewPost,
        updatePost,
        deletePost,
    } = postsTestManager(app);

    let createdNewBlog: BlogOutputDataModel;
    let createdNewPost: PostOutputDataModel;

    it(`✅ Should return ${HTTP_STATUSES.OK} code and empty array`, async () => {
        await getAllPosts();
    });

    it(`✅ Should return ${HTTP_STATUSES.CREATED} code and successfully create BLOG`, async () => {
        const correctDataCreateBlog: BlogInputDataModel = {
            name: "string",
            description: "string string string string string",
            websiteUrl: "https://wefwefwef.com"
        }
        const expectedResponseCreatedBlog: BlogOutputDataModel = {
            id: expect.any(String),
            createdAt: expect.stringMatching(REGEXPS.date_ISO),
            isMembership: expect.any(Boolean),
            ...correctDataCreateBlog,
        }

        const createdBlogResponse = await createNewBlog(correctDataCreateBlog, HTTP_STATUSES.CREATED);
        createdNewBlog = createdBlogResponse.body;
        expect(createdNewBlog).toEqual(expectedResponseCreatedBlog);
    });

    it(`✅ Should return ${HTTP_STATUSES.CREATED} code and successfully create POST`, async () => {
        const correctDataCreatePost: PostInputDataModel = {
            title: "Заголовок пример",
            shortDescription: "Короткое описание. Короткое описание. Короткое описание.",
            content: "Здесь какой-то контент. Здесь какой-то контент. Здесь какой-то контент. Здесь какой-то контент.",
            blogId: createdNewBlog.id,
        }
        const expectedResponseCreatedPost: PostOutputDataModel = {
            id: expect.any(String),
            blogName: createdNewBlog.name,
            createdAt: expect.stringMatching(REGEXPS.date_ISO),
            ...correctDataCreatePost,
        }

        const createdPostResponse = await createNewPost(correctDataCreatePost, HTTP_STATUSES.CREATED);
        createdNewPost = createdPostResponse.body;
        expect(createdNewPost).toEqual(expectedResponseCreatedPost);

        const allPosts = await getAllPosts();
        expect(allPosts.body).toEqual({
            page: 1,
            pageSize: 10,
            pagesCount: 1,
            totalCount: 1,
            items: [expectedResponseCreatedPost],
        });
    });

    it(`✅ Should return ${HTTP_STATUSES.OK} code and post by id`, async () => {
        const getPostResponse = await getPostById(createdNewPost.id, HTTP_STATUSES.OK);

        expect(getPostResponse.body).toEqual(createdNewPost);
    });

    it(`✅ Should return ${HTTP_STATUSES.NO_CONTENT} code and update post correctly`, async () => {
        const correctDataUpdatePost: PostInputDataModel = {
            title: "Заголовок НОВЫЙ",
            shortDescription: "Короткое описание НОВОЕ. Короткое описание НОВОЕ. Короткое описание НОВОЕ.",
            content: "Здесь какой-то НОВЫЙ контент. Здесь какой-то НОВЫЙ контент. Здесь какой-то НОВЫЙ контент. Здесь какой-то НОВЫЙ контент.",
            blogId: createdNewPost.blogId,
        }
        const expectedResponseUpdatedPost: PostOutputDataModel = {
            id: expect.any(String),
            createdAt: expect.stringMatching(REGEXPS.date_ISO),
            blogName: createdNewPost.blogName,
            ...correctDataUpdatePost,
        }

        await updatePost(createdNewPost.id, correctDataUpdatePost, HTTP_STATUSES.NO_CONTENT)

        const allPosts = await getAllPosts();

        expect(allPosts.body).toEqual({
            page: 1,
            pageSize: 10,
            pagesCount: 1,
            totalCount: 1,
            items: [expectedResponseUpdatedPost],
        });
    });

    it(`✅ Should return ${HTTP_STATUSES.NO_CONTENT} code and delete post (return empty items array)`, async () => {
        await deletePost(createdNewPost.id);

        const allPosts = await getAllPosts();

        expect(allPosts.body).toEqual({
            page: 1,
            pageSize: 10,
            pagesCount: 0,
            totalCount: 0,
            items: [],
        });
    });
});