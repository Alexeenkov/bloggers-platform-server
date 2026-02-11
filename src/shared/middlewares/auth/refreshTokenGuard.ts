import {NextFunction, Request, Response} from 'express';
import {HTTP_STATUSES} from '../../constants/httpStatuses';
import {jwtService} from '../../../modules/auth/adapters/jwt-service';

/**
 * Middleware для проверки refresh токена из HttpOnly cookie
 * Проверяет наличие и валидность refresh токена
 * Добавляет userId в req для последующих обработчиков
 */
export const refreshTokenGuard = async (
    req: Request & {refreshToken?: string},
    res: Response,
    next: NextFunction,
) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    try {
        const tokenPayload = await jwtService.verifyRefreshToken(refreshToken);

        if (!tokenPayload || typeof tokenPayload === 'string') {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

            return;
        }

        const {userId} = tokenPayload;

        if (!userId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

            return;
        }

        req.userId = userId;
    } catch (error) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);

        return;
    }

    next();
};