import {Express} from "express";
import {runDb} from "@/mongodb/db";
import * as dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3003;
const mongoUri = process.env.MONGO_URL;

if (!mongoUri) throw new Error('process.env.MONGO_URL does`t found');

export const startApp = async (app: Express) => {
    await runDb(mongoUri);

    app.listen(PORT, () => {
        console.log(`listening port: ${PORT}`);
    });
};