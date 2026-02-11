export interface RefreshTokenModel {
    id: string;
    userId: string;
    refreshToken: string;
    createdAt: Date;
    expiresAt: Date;
    deviceInfo?: string;
    ipAddress?: string;
}

export interface InvalidatedTokenModel {
    id: string;
    token: string;
    userId: string;
    invalidatedAt: Date;
    expiresAt: Date; // автоудаление через MongoDB TTL
}