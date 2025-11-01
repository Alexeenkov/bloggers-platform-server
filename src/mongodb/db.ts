import type {Collection, Db} from "mongodb";
import {MongoClient} from "mongodb";
import type {BlogModel} from "@/modules/blogs/models/blogsModels";
import type {PostModel} from "@/modules/posts/models/postsModels";
import type {UserModel} from "@/modules/users/models/usersModels";

let client: MongoClient | null = null;
let database: Db | null = null;

const getDatabase = (): Db => {
    if (!database) {
        throw new Error('Database not connected');
    }
    return database;
};

export const db = {
    get blogs(): Collection<BlogModel> {
        return getDatabase().collection<BlogModel>('blogs');
    },

    get posts(): Collection<PostModel> {
        return getDatabase().collection<PostModel>('posts');
    },

    get users(): Collection<UserModel> {
        return getDatabase().collection<UserModel>('users');
    },
};

export const runDb = async (url: string): Promise<void> => {
    client = new MongoClient(url);

    try {
        await client.connect();
        database = client.db();
        await database.command({ping: 1});

        console.log('✅ Connected successfully to mongo server');
    } catch (err) {
        console.log(`❌ Database is not connected: ${err}`);

        throw err;
    }
};

export const stopDb = async (): Promise<void> => {
    if (!client) {
        throw new Error(`❌ No active client`);
    }

    await client.close();
    client = null;
    database = null;
};