# Использование алиасов путей

## Настройка завершена ✅

В проекте настроены алиасы путей через `@/` относительно папки `src`.

## Команды для работы

### Разработка
```bash
# Полная production сборка проекта
yarn build

# Режим разработки (запускает 2 процесса одновременно)
yarn dev
```

Команда `yarn dev` автоматически:
- ✅ Отслеживает изменения в TypeScript файлах и компилирует их (TSC)
- ✅ Перезапускает приложение при изменениях (APP)
- ✅ Использует `module-alias` для резолва путей в runtime

### Тестирование
```bash
yarn test
```

## Примеры использования алиасов

```typescript
// Вместо относительных путей
import {blogsService} from "../../../application/blogsService";
import {HTTP_STATUSES} from "../../../../shared/constants/httpStatuses";

// Используйте алиасы
import {blogsService} from "@/modules/blogs/application/blogsService";
import {HTTP_STATUSES} from "@/shared/constants/httpStatuses";
```

## Как это работает

### Development (yarn dev)
1. **TypeScript** компилирует `.ts` файлы в `.js`, оставляя алиасы `@/` как есть
2. **module-alias** резолвит алиасы `@/` в runtime при запуске приложения
3. Нет необходимости заменять пути после каждой компиляции

### Production (yarn build)
1. **TypeScript** компилирует `.ts` файлы в `.js` с алиасами `@/`
2. **tsc-alias** заменяет все алиасы на правильные относительные пути
3. **Node.js** выполняет готовый код с относительными путями (быстрее, без overhead)

## Совместимость с Vercel

Настройка полностью совместима с деплоем на Vercel.

**Изменения в `vercel.json`:**
```json
{
  "buildCommand": "yarn build",
  "outputDirectory": "dist",
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ]
}
```

**Процесс деплоя:**
1. Vercel выполняет `yarn build`
2. TypeScript компилирует код в папку `dist`
3. `tsc-alias` заменяет алиасы `@/` на относительные пути
4. Vercel использует готовые `.js` файлы из `dist`

## Установленные пакеты

- `module-alias` - для runtime резолвинга алиасов в development режиме
- `tsc-alias` - для замены алиасов на относительные пути в production сборке
- `concurrently` - для одновременного запуска процессов в dev режиме

