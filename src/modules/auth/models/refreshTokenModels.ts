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
    token: string;
    userId: string;
    invalidatedAt: Date;
    expiresAt: Date;
}

export interface TokenPayloadModel {
    userId: string;
    exp: number;
}