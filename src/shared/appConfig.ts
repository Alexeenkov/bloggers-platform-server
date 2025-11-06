import {config} from "dotenv";
import {StringValue} from "ms";

config();

export const appConfig = {
    port: process.env.PORT || 3003,
    mongoUri: process.env.MONGO_URL,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    jwtSecret: process.env.TOKEN_SECRET as string,
    jwtExpiration: process.env.TOKEN_EXPIRATION as StringValue,
}