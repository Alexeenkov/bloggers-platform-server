import {db} from "../../../mongodb/db";
import {InvalidatedTokenModel} from "../models/refreshTokenModels";

export const invalidTokensRepository = {
    async setInvalidatedToken(data: InvalidatedTokenModel): Promise<void> {
        await db.invalidatedTokens.insertOne(data);
    },

    async checkTokenInvalidated(token: string): Promise<boolean> {
        return await db.invalidatedTokens.findOne({token}) !== null;
    },
};