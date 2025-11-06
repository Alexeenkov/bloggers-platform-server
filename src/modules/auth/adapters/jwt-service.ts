import jwt, {JwtPayload} from "jsonwebtoken";
import {appConfig} from "../../../shared/appConfig";

export const jwtService = {
    createToken(userId: string): string {
        return jwt.sign({userId}, appConfig.jwtSecret, {expiresIn: appConfig.jwtExpiration});
    },

    verifyToken(token: string): JwtPayload | string {
        return jwt.verify(token, appConfig.jwtSecret);
    },
}