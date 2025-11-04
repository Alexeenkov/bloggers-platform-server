# Критичные проблемы

## 1. Отсутствие транзакций
При создании связанных сущностей (например, пост для блога) нет транзакций - может привести к inconsistent state.

```ts
// Правильный подход с транзакцией
export const postsService = {
    async create(data: PostInputDataModel): Promise<string> {
        const session = db.startSession();
        
        try {
            await session.withTransaction(async () => {
                // Все операции в рамках одной транзакции
                const blog = await blogsQueryRepository.findBlogName(
                    data.blogId,
                    { session } // передаем сессию
                );

                if (!blog) {
                    throw new CustomError('blogId', 'Blog not found', HTTP_STATUSES.NOT_FOUND);
                }

                const newPost: PostModel = {
                    title: data.title,
                    shortDescription: data.shortDescription,
                    content: data.content,
                    blogId: data.blogId,
                    blogName: blog.name,
                    createdAt: createDateISO(new Date()),
                };

                return await postsRepository.create(newPost, { session });
            });
        } finally {
            await session.endSession();
        }
    }
};
```

### Преимущества транзакций:
- Atomicity (Атомарность) - либо все операции выполняются, либо ни одна
- Consistency (Согласованность) - БД всегда в консистентном состоянии
- Isolation (Изоляция) - параллельные запросы не видят промежуточные состояния
- Durability (Долговечность) - результаты сохраняются даже при сбоях

### Когда нужны транзакции в вашем проекте:
- ✅ Создание/обновление поста (проверка блога + запись)
- ✅ Удаление блога (нужно удалить все связанные посты)
- ✅ Обновление имени блога (обновить в блоге + во всех постах)
- ✅ Создание пользователя с проверкой уникальности (хотя лучше использовать unique index)

### Рекомендация:

Добавить поддержку транзакций в db объект:
```ts
export const db = {
    // ... existing getters
    
    async withTransaction<T>(
        callback: (session: ClientSession) => Promise<T>
    ): Promise<T> {
        const session = client!.startSession();
        try {
            return await session.withTransaction(callback);
        } finally {
            await session.endSession();
        }
    }
};
```

## 2. 