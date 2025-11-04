import express, {Express, Request, Response} from 'express';
import {HTTP_STATUSES} from "./shared/constants/httpStatuses";
import {postsRouter} from "./modules/posts/router/postsRouter";
import {blogsRouter} from "./modules/blogs/router/blogsRouter";
import {testingRouter} from "./testing/router/testingRouter";
import {TESTING_ROUTER_PATH} from "./testing/constants/testingRouterPath";
import {swaggerRouter} from "./docs/swagger/swaggerRouter";
import {
    API_ROUTER_PATH,
    AUTH_ROUTER_PATH,
    BLOGS_ROUTER_PATH,
    POSTS_ROUTER_PATH,
    USERS_ROUTER_PATH
} from "./shared/constants/routersPaths";
import {usersRouter} from "./modules/users/router/usersRouter";
import {customErrorMiddleware} from "./shared/middlewares/customError/customErrorMiddleware";
import cors from 'cors';
import {authRouter} from "./modules/auth/router/authRouter";

export const setupApp = (app: Express): Express => {
    app.use(cors({
        origin: '*',
    }));
    app.use(express.json());

    app.get('/', (_: Request, res: Response) => {
        res.status(HTTP_STATUSES.OK).send('Bloggers platform server');
    });

    app.use(BLOGS_ROUTER_PATH, blogsRouter);
    app.use(POSTS_ROUTER_PATH, postsRouter);
    app.use(USERS_ROUTER_PATH, usersRouter);
    app.use(AUTH_ROUTER_PATH, authRouter);
    app.use(API_ROUTER_PATH, swaggerRouter);
    app.use(TESTING_ROUTER_PATH, testingRouter);
    app.use(customErrorMiddleware);

    return app;
}