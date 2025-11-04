import {config} from "dotenv";

config();

export const appConfig = {
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URL,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
}