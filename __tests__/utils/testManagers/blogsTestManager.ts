// @ts-ignore
import request from 'supertest';
import {HTTP_STATUSES, TypeHttpStatus} from "@/shared/constants/httpStatuses";
import type {BlogInputDataModel} from "@/modules/blogs/models/blogsModels";
import {generateBasicAuthToken} from "../generateBasicAuthToken";
import {Express} from "express";
import {PostInputDataForBlogModel} from "@/modules/posts/models/postsModels";
import {BLOGS_ROUTER_PATH} from "@/shared/constants/routersPaths";

const adminToken = generateBasicAuthToken();

export const blogsTestManager = (app: Express) => {
    return {
        getAllBlogs: async () => {
            return await request(app)
                .get(BLOGS_ROUTER_PATH)
                .expect(HTTP_STATUSES.OK);
        },

        getBlogById: async (
            id: string,
            expectedHttpStatus: TypeHttpStatus,
        ) => {
            return await request(app)
                .get(`${BLOGS_ROUTER_PATH}/${id}`)
                .expect(expectedHttpStatus);
        },

        createNewBlog: async (
            data: BlogInputDataModel,
            expectedHttpStatus: TypeHttpStatus,
        ) => {
            return await request(app)
                .post(BLOGS_ROUTER_PATH)
                .set('Authorization', adminToken)
                .send(data)
                .expect(expectedHttpStatus);
        },

        getPostsForBlog: async (
            id: string,
            expectedHttpStatus: TypeHttpStatus,
        ) => {
            return await request(app)
                .get(`${BLOGS_ROUTER_PATH}/${id}/posts`)
                .expect(expectedHttpStatus);
        },

        createNewPostForBlog: async (
            id: string,
            data: PostInputDataForBlogModel,
            expectedHttpStatus: TypeHttpStatus,
        ) => {
            return await request(app)
                .post(`${BLOGS_ROUTER_PATH}/${id}/posts`)
                .set('Authorization', adminToken)
                .send(data)
                .expect(expectedHttpStatus);
        },

        updateBlog: async (
            id: string,
            data: BlogInputDataModel,
            expectedHttpStatus: TypeHttpStatus,
        ) => {
            return await request(app)
                .put(`${BLOGS_ROUTER_PATH}/${id}`)
                .set('Authorization', adminToken)
                .send(data)
                .expect(expectedHttpStatus);
        },

        deleteBlog: async (id: string) => {
            return await request(app)
                .delete(`${BLOGS_ROUTER_PATH}/${id}`)
                .set('Authorization', adminToken)
                .expect(HTTP_STATUSES.NO_CONTENT);
        },
    };
};