import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../../shared/constants/httpStatuses";
import {db} from "../../mongodb/db";

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (_: Request, res: Response) => {
    await Promise.all([
        db.blogs.deleteMany(),
        db.posts.deleteMany(),
        db.users.deleteMany(),
    ]);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT);
});
