# Auth Module Architecture

## Слоистая архитектура

### Принципы разделения ответственности

```
Middleware → Handler → Service → Repository → Database
```

## Refresh Token Flow

### 1️⃣ Middleware Layer: `refreshTokenGuard.ts`

**Ответственность:**
- ✅ Извлечение токена из cookie
- ✅ Валидация JWT (подпись, срок действия)
- ✅ Извлечение userId из payload
- ✅ Передача данных в request

**НЕ делает:**
- ❌ Проверка black list
- ❌ Обращение к БД
- ❌ Бизнес-логика

**Почему:**
- Middleware должен быть "тонким" - только валидация
- `shared/middlewares` не должен зависеть от `modules/auth/repository`
- Избегаем циклических зависимостей
- Упрощается тестирование

---

### 2️⃣ Handler Layer: `refreshTokenHandler.ts` / `logoutHandler.ts`

**Ответственность:**
- ✅ HTTP request/response обработка
- ✅ Вызов service методов
- ✅ Установка/очистка cookies
- ✅ Форматирование ответа

**НЕ делает:**
- ❌ Бизнес-логику
- ❌ Прямые обращения к repository

---

### 3️⃣ Service Layer: `authService.ts`

**Ответственность:**
- ✅ **Проверка black list** (здесь!)
- ✅ Token rotation (инвалидация старого токена)
- ✅ Генерация новых токенов
- ✅ Координация операций
- ✅ Обработка ошибок

**Методы:**
- `refreshToken()` - обновление токенов + проверка black list
- `logout()` - добавление токена в black list

---

### 4️⃣ Repository Layer: `refreshTokenRepository.ts`

**Ответственность:**
- ✅ CRUD операции с БД
- ✅ Работа с коллекциями `refreshTokens` и `invalidatedTokens`

**Методы:**
- `isTokenInvalidated()` - проверка наличия в black list
- `setInvalidatedToken()` - добавление в black list

---

## Почему black list проверка в Service, а не в Middleware?

### ❌ Плохо: Проверка в Middleware

```typescript
// BAD: Middleware зависит от repository
import {refreshTokenRepository} from '../../../modules/auth/repository';

export const refreshTokenGuard = async (req, res, next) => {
  // ...JWT валидация...
  
  // ❌ Middleware обращается к БД
  const isInvalidated = await refreshTokenRepository.isTokenInvalidated(token);
  
  next();
};
```

**Проблемы:**
1. Нарушение слоистой архитектуры
2. Зависимость `shared/` → `modules/auth/`
3. Middleware перегружен логикой
4. Сложнее тестировать
5. Дублирование проверки (она уже есть в service)

---

### ✅ Хорошо: Проверка в Service

```typescript
// GOOD: Middleware только JWT валидация
export const refreshTokenGuard = (req, res, next) => {
  const token = req.cookies?.refreshToken;
  const payload = jwtService.verifyRefreshToken(token);
  
  req.userId = payload.userId;
  req.refreshToken = token;
  next();
};

// GOOD: Service делает бизнес-логику
export const authService = {
  async refreshToken(token: string) {
    // ✅ Проверка black list здесь
    const isInvalidated = await refreshTokenRepository.isTokenInvalidated(token);
    if (isInvalidated) throw new Error('Token revoked');
    
    // ...остальная логика...
  }
};
```

**Преимущества:**
1. ✅ Правильная слоистая архитектура
2. ✅ Нет зависимости shared → modules
3. ✅ Middleware переиспользуем
4. ✅ Легче тестировать
5. ✅ Одна точка проверки

---

## Диаграмма вызовов

```
POST /auth/refresh-token
        ↓
┌───────────────────────┐
│ refreshTokenGuard     │ ← Cookie + JWT validation
└─────────┬─────────────┘
          │ req.refreshToken
          │ req.userId
          ▼
┌───────────────────────┐
│ refreshTokenHandler   │ ← HTTP handling
└─────────┬─────────────┘
          │ authService.refreshToken(token)
          ▼
┌───────────────────────┐
│ authService           │ ← Business logic
│ .refreshToken()       │ ← Black list check HERE
└─────────┬─────────────┘
          │ repository calls
          ▼
┌───────────────────────┐
│ refreshTokenRepository│ ← Database operations
│ .isTokenInvalidated() │
│ .setInvalidatedToken()│
└───────────────────────┘
```

---

## Аналогия с другими middleware

### `bearerAuthGuard` (тоже только JWT валидация)

```typescript
export const bearerAuthGuard = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const payload = jwtService.verifyToken(token); // только JWT
  
  req.userId = payload.userId;
  next();
  // НЕ проверяет БД, НЕ делает бизнес-логику
};
```

---

## Best Practices

### ✅ DO:
- Middleware - только валидация входных данных
- Service - вся бизнес-логика + обращения к repository
- Repository - только CRUD операции
- Handler - только HTTP request/response

### ❌ DON'T:
- Middleware → Repository (пропуск service слоя)
- Handler → Repository (пропуск service слоя)
- Shared → Modules (неправильные зависимости)
- Дублирование логики в разных слоях

---

## Тестирование

### Middleware (unit test)

```typescript
describe('refreshTokenGuard', () => {
  it('should extract userId from valid JWT', () => {
    // Только JWT валидация
    // НЕ нужно мокать БД
  });
});
```

### Service (integration test)

```typescript
describe('authService.refreshToken', () => {
  it('should reject invalidated token', async () => {
    // Мокаем repository.isTokenInvalidated() → true
    // Проверяем, что выбросится ошибка
  });
});
```

---

## Итого

**Правильная архитектура:**
- Middleware: валидация
- Handler: HTTP
- **Service: бизнес-логика + black list check** ← здесь!
- Repository: БД

Это обеспечивает:
- 🏗️ Чистую архитектуру
- 🧪 Простое тестирование
- ♻️ Переиспользуемость
- 📦 Правильные зависимости
