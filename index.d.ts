/**
 * Глобальное расширение типов Express
 * Добавляет кастомные поля в Request для аутентификации
 */
declare global {
    namespace Express {
        export interface Request {
            /**
             * ID пользователя, извлеченный из JWT токена
             * Устанавливается middleware: bearerAuthGuard, refreshTokenGuard
             */
            userId?: string;

            /**
             * Refresh token из HttpOnly cookie
             * Устанавливается middleware: refreshTokenGuard
             */
            refreshToken?: string;
        }
    }
}

export { }