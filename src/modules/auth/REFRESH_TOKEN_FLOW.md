# Refresh Token Flow Documentation

## Обзор

Система JWT аутентификации с использованием Access и Refresh токенов, реализованная с поддержкой:
- ✅ HttpOnly cookies для безопасного хранения refresh токенов
- ✅ Black list инвалидированных токенов
- ✅ Автоматическое удаление старых токенов через MongoDB TTL индексы
- ✅ Token rotation при обновлении (старый токен инвалидируется)

## Архитектура

### Слоистая архитектура

```
┌─────────────────────────────────────────┐
│  Middleware (Infrastructure Layer)      │
│  - JWT валидация                        │
│  - Извлечение данных из токена          │
│  - НЕ обращается к БД                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Handler (Presentation Layer)           │
│  - HTTP request/response                │
│  - Вызывает service                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Service (Application/Business Layer)   │
│  - Бизнес-логика                        │
│  - Проверка black list                  │
│  - Token rotation                       │
│  - Вызывает repository                  │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│  Repository (Data Layer)                │
│  - Работа с БД                          │
│  - CRUD операции                        │
└─────────────────────────────────────────┘
```

**Почему middleware НЕ проверяет black list:**
- ✅ Соблюдение принципа разделения ответственности
- ✅ Избегаем зависимости `shared/` → `modules/`
- ✅ Middleware не должен обращаться к БД
- ✅ Упрощается тестирование
- ✅ Переиспользуемость middleware

### Access Token
- **Время жизни**: 24 часа (настраивается через `TOKEN_EXPIRATION`)
- **Хранение на клиенте**: Memory или sessionStorage
- **Передача**: `Authorization: Bearer <token>` header
- **Назначение**: Доступ к защищенным API endpoints

### Refresh Token
- **Время жизни**: 30 дней (настраивается через `REFRESH_TOKEN_EXPIRATION`)
- **Хранение на клиенте**: HttpOnly cookie (защита от XSS)
- **Передача**: Автоматически через cookie
- **Назначение**: Обновление access токена, logout

### Black List (Инвалидированные токены)
- **Коллекция MongoDB**: `invalidatedTokens`
- **TTL индекс**: Автоматическое удаление по полю `expiresAt`
- **Проверка**: При каждом использовании refresh токена

## API Endpoints

### 1. Login - `/auth/login` (POST)

**Request:**
```json
{
  "loginOrEmail": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGc..."
}
```

**Cookie (HttpOnly):**
```
refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
```

**Логика:**
1. Проверка credentials
2. Генерация пары токенов (access + refresh)
3. Refresh token → HttpOnly cookie
4. Access token → JSON response

---

### 2. Refresh Token - `/auth/refresh-token` (POST)

**Request:** Токен берется из cookie автоматически

**Response:**
```json
{
  "accessToken": "eyJhbGc..."
}
```

**Cookie (HttpOnly):** Новый refresh token

**Логика:**
1. Извлечение refresh token из cookie
2. Проверка валидности JWT
3. Проверка black list
4. Инвалидация старого токена (добавление в black list)
5. Генерация новой пары токенов
6. Новый refresh token → cookie
7. Новый access token → JSON response

**Token Rotation** - критично для безопасности! Старый refresh token становится недействительным.

---

### 3. Logout - `/auth/logout` (POST)

**Request:** Токен берется из cookie автоматически

**Response:** 204 No Content

**Логика:**
1. Извлечение refresh token из cookie
2. Добавление токена в black list
3. Очистка cookie
4. Возврат 204 статуса

---

## Middleware

### `refreshTokenGuard`

**Путь:** `src/shared/middlewares/auth/refreshTokenGuard.ts`

**Назначение:** Проверка refresh токена перед доступом к `/refresh-token` и `/logout`

**Ответственность (только валидация JWT):**
1. ✅ Наличие токена в cookie
2. ✅ Валидность JWT (подпись, срок действия)
3. ✅ Наличие userId в payload

**НЕ проверяет:**
- ❌ Black list (это делает `authService` для правильной слоистой архитектуры)
- ❌ Бизнес-логику (responsibility service слоя)

**Результат:** Добавляет `req.userId` и `req.refreshToken` для handlers

**Почему black list НЕ в middleware:**
- Middleware не должен зависеть от repository слоя
- Избегаем зависимости `shared/` → `modules/auth/`
- Упрощается тестирование
- Соблюдается слоистая архитектура

---

### `bearerAuthGuard`

**Путь:** `src/shared/middlewares/auth/bearerAuthGuard.ts`

**Назначение:** Проверка access токена для защищенных API endpoints

**Проверки:**
1. ✅ Наличие `Authorization: Bearer` header
2. ✅ Валидность JWT

---

## MongoDB Collections

### `invalidatedTokens`

**Структура:**
```typescript
{
  _id: ObjectId,
  token: string,           // refresh token
  userId: string,
  invalidatedAt: Date,     // когда инвалидирован
  expiresAt: Date          // когда удалится автоматически
}
```

**Индексы:**
1. **TTL Index:** `{expiresAt: 1}` с `expireAfterSeconds: 0`
   - Автоматическое удаление документов после `expiresAt`
   - Фоновый процесс MongoDB (каждые 60 секунд)

2. **Unique Index:** `{token: 1}`
   - Предотвращает дубликаты
   - Ускоряет поиск при проверке black list

---

### `refreshTokens` (опционально)

**Структура:**
```typescript
{
  _id: ObjectId,
  userId: string,
  refreshToken: string,
  createdAt: Date,
  expiresAt: Date,
  deviceInfo?: string,
  ipAddress?: string
}
```

**Назначение:** Хранение активных refresh токенов (для мульти-девайс логики)

**TTL Index:** `{expiresAt: 1}` для автоочистки

---

## Безопасность

### ✅ Защита от XSS
- Refresh token в **HttpOnly cookie** - недоступен для JavaScript
- Access token в памяти приложения (не в localStorage)

### ✅ Защита от CSRF
- Cookie с `SameSite=Strict`
- Дополнительно можно добавить CSRF токен

### ✅ Token Rotation
- При refresh старый токен инвалидируется
- Предотвращает повторное использование украденных токенов

### ✅ Black List
- Проверка при каждом использовании refresh токена
- Мгновенная инвалидация при logout

### ✅ TTL Индексы
- Автоматическая очистка старых записей
- Нет накопления мусора в БД

---

## Переменные окружения

```env
# JWT Secrets (должны быть разными!)
TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Время жизни токенов
TOKEN_EXPIRATION=24h          # Access token (рекомендуется 15m - 24h)
REFRESH_TOKEN_EXPIRATION=30d  # Refresh token (рекомендуется 7d - 30d)

# Окружение
NODE_ENV=production            # Для secure cookies
```

---

## Диаграмма потока

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       │ 1. POST /auth/login
       │    {loginOrEmail, password}
       ▼
┌─────────────────┐
│  Login Handler  │
└────────┬────────┘
         │
         │ 2. Generate tokens
         ▼
┌─────────────────┐
│   Set Cookie    │  refreshToken (HttpOnly)
│   Return JSON   │  {accessToken}
└────────┬────────┘
         │
         │ 3. Use accessToken for API calls
         │    Authorization: Bearer <accessToken>
         ▼
┌─────────────────┐
│ Protected APIs  │
└─────────────────┘
         │
         │ 4. accessToken expired?
         │    POST /auth/refresh-token
         ▼
┌──────────────────────┐
│ Refresh Token Guard  │ ← Check cookie & JWT validity
└──────────┬───────────┘
           │
           │ 5. JWT is valid
           ▼
┌──────────────────────┐
│ Refresh Handler      │ → calls authService.refreshToken()
└──────────┬───────────┘
           │
           │ 6. Check Black List (in authService)
           │    Invalidate old token
           │    Generate new tokens
           ▼
┌──────────────────────┐
│  Black List (DB)     │  + old token
│  New Cookie          │  + new refreshToken
│  Return JSON         │  + {accessToken}
└──────────────────────┘
```

---

## Примеры использования

### Frontend (TypeScript)

```typescript
// Login
const login = async (loginOrEmail: string, password: string) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    credentials: 'include', // Важно! Для отправки cookies
    body: JSON.stringify({loginOrEmail, password}),
  });
  
  const {accessToken} = await response.json();
  // Сохранить accessToken в память (не в localStorage!)
  return accessToken;
};

// Refresh Token
const refreshAccessToken = async () => {
  const response = await fetch('/auth/refresh-token', {
    method: 'POST',
    credentials: 'include', // Cookie отправится автоматически
  });
  
  const {accessToken} = await response.json();
  return accessToken;
};

// Logout
const logout = async () => {
  await fetch('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
};
```

---

## Troubleshooting

### Проблема: "Token has been revoked"
**Причина:** Токен в black list (уже использован для refresh или logout)
**Решение:** Перелогиниться через `/auth/login`

### Проблема: TTL не удаляет документы
**Причина:** 
1. Индекс не создан
2. Поле `expiresAt` не типа Date

**Решение:**
```bash
# Проверить индексы
db.invalidatedTokens.getIndexes()

# Пересоздать индекс
db.invalidatedTokens.dropIndex("expiresAt_1")
# Перезапустить сервер (создастся автоматически)
```

### Проблема: Cookie не устанавливается
**Причина:** `secure: true` в development (требует HTTPS)
**Решение:** Использовать `secure: process.env.NODE_ENV === 'production'`

---

## Best Practices

1. ✅ **Разные секреты** для access и refresh токенов
2. ✅ **Короткий TTL** для access token (15 минут идеально)
3. ✅ **Token rotation** при каждом refresh
4. ✅ **HttpOnly + Secure + SameSite** для cookies
5. ✅ **Black list проверка** перед каждым использованием refresh токена
6. ✅ **TTL индексы** для автоочистки БД
7. ✅ **Логирование** подозрительных активностей (повторное использование инвалидированного токена)

---

## TODO (опционально)

- [ ] Добавить device tracking (несколько устройств на одного пользователя)
- [ ] Логирование попыток использования инвалидированных токенов
- [ ] Rate limiting для `/auth/refresh-token`
- [ ] Добавить Redis для быстрой проверки black list (перед MongoDB)
- [ ] Email уведомления при logout со всех устройств
