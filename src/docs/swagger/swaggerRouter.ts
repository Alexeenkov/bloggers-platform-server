import {Request, Response, Router} from 'express';
import path from "path";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";

export const getSwaggerRouter = () => {
  const router = Router({});

  router.get('/', (_: Request, res: Response) => {
    const filePath = path.resolve(__dirname, 'index.html');

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(HTTP_STATUSES.NOT_FOUND).send(`File not found by path: ${filePath}`);
      }
    });
  });

  router.get('/specSwagger.js', (_: Request, res: Response) => {
    const filePath = path.resolve(__dirname, 'specSwagger.js');

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(HTTP_STATUSES.NOT_FOUND).send(`File not found by path: ${filePath}`);
      }
    });
  });

  return router;
};
