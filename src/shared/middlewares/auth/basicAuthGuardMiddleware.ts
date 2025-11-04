import {NextFunction, Request, Response} from 'express';
import {HTTP_STATUSES} from "../../constants/httpStatuses";
import {appConfig} from "../../appConfig";

export const basicAuthGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'] as string;

  if (!auth) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

    return;
  }

  const [authType, token] = auth.split(' ');

  if (authType !== 'Basic') {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');

  const [username, password] = credentials.split(':');

  if (username !== appConfig.adminUsername || password !== appConfig.adminPassword) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

    return;
  }

  next();
};
