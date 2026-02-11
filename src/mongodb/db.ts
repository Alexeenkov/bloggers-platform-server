import type {Collection, Db} from "mongodb";
import {MongoClient} from "mongodb";
import type {BlogModel} from "../modules/blogs/models/blogsModels";
import type {PostModel} from "../modules/posts/models/postsModels";
import type {UserModel} from "../modules/users/models/usersModels";
import type {CommentDBModel} from "../modules/comments/models/commentsModel";
import type {RefreshTokenModel, InvalidatedTokenModel} from "../modules/auth/models/refreshTokenModels";

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
    get comments(): Collection<CommentDBModel> {
        return getDatabase().collection<CommentDBModel>('comments');
    },
    get refreshTokens(): Collection<RefreshTokenModel> {
        return getDatabase().collection<RefreshTokenModel>('refreshTokens');
    },
    get invalidatedTokens(): Collection<InvalidatedTokenModel> {
        return getDatabase().collection<InvalidatedTokenModel>('invalidatedTokens');
    },
};

/**
 * Соединяется с MongoDB
 */
const connectToDatabase = async (url: string): Promise<void> => {
    try {
        client = new MongoClient(url);
        await client.connect();
        database = client.db();
        await database.command({ping: 1});

        console.log('✅ Connected successfully to mongo server');
    } catch (err) {
        console.log(`❌ Database is not connected: ${err}`);
    }
};

/**
 * Создает TTL индексы для автоматического удаления документов
 * и поиска инвалидированных токенов по токену
 * 
 * @description
 * Документы refreshTokens удаляются сразу после даты в поле expiresAt.
 * Документы invalidatedTokens удаляются сразу после даты в поле expiresAt.
 * Документы invalidatedTokens ищутся по токену в поле token.
 */
const createIndexes = async (): Promise<void> => {
    try {
        await db.refreshTokens.createIndex(
            {expiresAt: 1},
            {expireAfterSeconds: 0},
        );
        await db.invalidatedTokens.createIndex(
            {expiresAt: 1},
            {expireAfterSeconds: 0},
        );
        await db.invalidatedTokens.createIndex(
            {token: 1},
            {name: 'invalidatedTokens_token_index'},
        );

        console.log(`✅ TTL indexes created successfully`);
    } catch (err) {
        console.log(`❌ Error creating TTL indexes: ${err}`);
    }
};

export const runDb = async (url: string): Promise<void> => {
    await connectToDatabase(url);
    await createIndexes();
};

export const stopDb = async (): Promise<void> => {
    if (!client) {
        throw new Error(`❌ No active client`);
    }

    await client.close();
    client = null;
    database = null;
};