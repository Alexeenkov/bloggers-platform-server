import {NextFunction, Request, Response} from 'express';
import {HTTP_STATUSES} from '../../constants/httpStatuses';
import {jwtService} from '../../../modules/auth/adapters/jwt-service';

/**
 * Middleware для проверки refresh токена из HttpOnly cookie
 * 
 * Ответственность:
 * - Проверяет наличие refresh токена в cookie
 * - Верифицирует JWT подпись и срок действия
 * - Извлекает userId из payload
 * - Добавляет userId и refreshToken в req для последующих обработчиков
 * 
 * НЕ проверяет:
 * - Black list (проверка в authService для избежания зависимости middleware -> repository)
 * - Бизнес-логику (это ответственность service слоя)
 * 
 * @example
 * authRouter.post('/refresh-token', refreshTokenGuard, refreshTokenHandler);
 */
export const refreshTokenGuard = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return;
    }

    try {
        // Проверяем валидность JWT токена (подпись, срок действия)
        const tokenPayload = jwtService.verifyRefreshToken(refreshToken);

        if (!tokenPayload || typeof tokenPayload === 'string') {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
            return;
        }

        const {userId} = tokenPayload;

        if (!userId) {
            res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
            return;
        }

        // Добавляем userId и сам токен в request для использования в handlers
        // Handler/Service будет проверять black list и другую бизнес-логику
        req.userId = userId;
        req.refreshToken = refreshToken;
    } catch (error) {
        // JWT невалиден (истек, подделан, неверный секрет и т.д.)
        res.sendStatus(HTTP_STATUSES.UNAUTHORIZED);
        return;
    }

    next();
};