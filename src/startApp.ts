import {Express} from "express";
import {runDb} from "./mongodb/db";
import {appConfig} from "./shared/appConfig";

export const startApp = async (app: Express) => {
    if (Object.values(appConfig).some((key) => key === undefined)) {
        throw new Error('Environment variables are not set');
    }

    await runDb(appConfig.mongoUri!);

    app.listen(appConfig.port, () => {
        console.log(`listening port: ${appConfig.port}`);
    });
};