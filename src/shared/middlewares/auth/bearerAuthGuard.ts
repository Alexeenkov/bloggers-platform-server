import {NextFunction, Request, Response} from 'express';
import {HTTP_STATUSES} from "../../constants/httpStatuses";
import {jwtService} from '../../../modules/auth/adapters/jwt-service';

export const bearerAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const headerAuthorization = req.headers['authorization'] as string;

  if (!headerAuthorization) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

    return;
  }

  const [authType, token] = headerAuthorization.split(' ');

  if (authType !== 'Bearer') {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

    return;
  }

  try {
    // TODO: shared middleware зависит от модуля auth. Нужно избавиться от этой зависимости.
    const tokenPayload = jwtService.verifyAccessToken(token);

    if (!tokenPayload || typeof tokenPayload === 'string') {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

      return;
    }

    const {userId} = tokenPayload;

    req.userId = userId;
  } catch (error) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

    return;
  }

  next();
};
