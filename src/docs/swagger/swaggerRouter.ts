import {Request, Response, Router} from 'express';
import path from "path";
import {HTTP_STATUSES} from "../../shared/constants/httpStatuses";

export const swaggerRouter = Router({});

swaggerRouter.get('/', (_: Request, res: Response) => {
  const filePath = path.resolve(__dirname, 'index.html');

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(HTTP_STATUSES.NOT_FOUND).send(`File not found by path: ${filePath}`);
    }
  });
});

swaggerRouter.get('/specSwagger.js', (_: Request, res: Response) => {
  const filePath = path.resolve(__dirname, 'specSwagger.js');

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(HTTP_STATUSES.NOT_FOUND).send(`File not found by path: ${filePath}`);
    }
  });
});

