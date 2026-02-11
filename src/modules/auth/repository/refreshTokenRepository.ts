import {ObjectId} from "mongodb";
import {db} from "../../../mongodb/db";
import {InvalidatedTokenModel, RefreshTokenModel} from "../models/refreshTokenModels";

export const refreshTokenRepository = {
    async createRefreshToken(data: Omit<RefreshTokenModel, 'id'>): Promise<void> {
        await db.refreshTokens.insertOne({
            id: new ObjectId().toString(),
            ...data,
        });
    },

    async deleteRefreshToken(refreshToken: string): Promise<void> {
        await db.refreshTokens.deleteOne({refreshToken});
    },

    async getRefreshToken(refreshToken: string): Promise<RefreshTokenModel | null> {
        return await db.refreshTokens.findOne({refreshToken});
    },

    async setInvalidatedToken(data: Omit<InvalidatedTokenModel, 'id'>): Promise<void> {
        await db.invalidatedTokens.insertOne({
            id: new ObjectId().toString(),
            ...data,
        });
    },

    async isTokenInvalidated(token: string): Promise<boolean> {
        return await db.invalidatedTokens.findOne({token}) !== null;
    },
};