import jwt, {type JwtPayload} from "jsonwebtoken";
import {appConfig} from "../../../shared/appConfig";
import {CustomError} from "../../../shared/utils/CustomError";
import {HTTP_STATUSES} from "../../../shared/constants/httpStatuses";
import {refreshTokenRepository} from "../repository/refreshTokenRepository";

export const jwtService = {
    createToken(userId: string): string {
        return jwt.sign({userId}, appConfig.jwtSecret, {
            expiresIn: appConfig.jwtExpiration,
        });
    },

    createRefreshToken(userId: string): string {
        return jwt.sign({userId}, appConfig.jwtRefreshSecret, {
            expiresIn: appConfig.refreshTokenExpiration,
        });
    },

    verifyAccessToken(token: string): string | JwtPayload {
        return jwt.verify(token, appConfig.jwtSecret);
    },

    verifyRefreshToken(token: string): string | JwtPayload {
        return jwt.verify(token, appConfig.jwtRefreshSecret);
    },
}