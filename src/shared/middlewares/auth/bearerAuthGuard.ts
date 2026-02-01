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
    const tokenPayload = jwtService.verifyToken(token);

    if (!tokenPayload || typeof tokenPayload === 'string') {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

      return;
    }

    const {userId} = tokenPayload;

    req.body.userId = userId;
  } catch {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

    return;
  }
  next();
};
