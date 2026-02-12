import {config} from "dotenv";
import {StringValue} from "ms";

config();

export const appConfig = {
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || 3003,
    mongoUri: process.env.MONGO_URL,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    jwtSecret: process.env.TOKEN_SECRET as string,
    jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET as string,
    jwtExpiration: process.env.TOKEN_EXPIRATION as StringValue,
    refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION as StringValue,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
}