# descksp-agents — Партнёрский портал N1 Products

## Что это
Агентский портал для партнёров N1 Products. Агенты знакомятся с продуктами и берут материалы для встреч с клиентами. Реального оформления сделок из портала нет.

## Стек
- Next.js 14.2.35 (App Router)
- Supabase (auth + database)
- Vercel (деплой)
- JavaScript (без TypeScript)

## Локальная разработка
```bash
cd ~/projects/descksp-agents
npm run dev        # http://localhost:3000
```
`.env.local` уже настроен — Supabase подключён.

## Supabase
- Проект: **N1Desk-PROD** (`mdghihjgcwxezrwakejc`)
- Используется как DEV (реальный PROD перенесён в другую среду)
- Регион: ap-southeast-2 (Sydney)

## Роли в портале (поле `portal_role` в таблице `agents`)
| Роль | Доступ |
|------|--------|
| `agent` | Видит активные продукты, свои продажи и комиссии |
| `manager` | Всё выше + управление продуктами (`/admin/products`) |

## Тестовые аккаунты
| Email | Password | Роль |
|-------|----------|------|
| `malakhov19851985+test@gmail.com` | `Test1234!` | manager |
| `malakhov19851985+agent@gmail.com` | `Agent1234!` | agent |

Письма приходят на `malakhov19851985@gmail.com` (Gmail-алиасы).

## Таблицы БД (ключевые)
- `agents` — агенты портала, поля: `user_id`, `portal_role`, `status`, `contact_email`
- `agent_products` — продукты агентского канала (отдельные от внутренних `products`)
- `agent_product_materials` — файлы/ссылки к продуктам (presentation, factsheet, video)
- `roles` — внутренние роли (admin, trader, back_office и др.) — не для агентского портала

## Жизненный цикл продукта
```
draft → active → archived
```
Менеджер создаёт продукт, публикует → агенты видят. Архивированные агенты не видят.

## Структура проекта
```
app/
├── page.js                    # Лендинг (N1 Products, © 2026)
├── login/page.js              # Страница входа
├── api/auth/route.js          # API: login / verify / logout
├── dashboard/
│   ├── layout.js              # Сайдбар с меню (менеджеры видят раздел "Управление")
│   ├── page.js                # Главная (mock данные — TODO: подключить БД)
│   ├── products/page.js       # Витрина продуктов (читает из agent_products)
│   ├── sales/page.js          # Мои продажи (mock — TODO)
│   └── commissions/page.js    # Комиссии (mock — TODO)
└── admin/
    └── products/page.js       # Управление продуктами (только managers)
lib/
└── supabase.js                # Supabase client
scripts/
└── create-test-user.mjs       # Скрипт создания пользователей
```

## Что сделано
- [x] Настроена локальная среда (Node 24, npm 11, gh CLI)
- [x] Supabase подключён через .env.local
- [x] Next.js обновлён 14.0.4 → 14.2.35 (критическая CVE закрыта)
- [x] Брендинг: N1 CAPITAL → N1 PRODUCTS, год 2024 → 2026
- [x] Таблицы `agent_products` и `agent_product_materials` созданы с RLS
- [x] Роль `portal_role` добавлена в `agents`
- [x] Страница `/admin/products` — CRUD продуктов для менеджеров
- [x] Страница `/dashboard/products` — витрина из реальной БД
- [x] Авторизация сохраняет `portal_role` в localStorage

## TODO (открытые задачи)
- [ ] Продумать процесс онбординга агента (регистрация → проверка → активация)
- [ ] Подключить реальные данные на главной dashboard (продажи, комиссии)
- [ ] Подключить реальные данные на страницах sales и commissions
- [ ] Раздел "Материалы" для продуктов (загрузка PDF, видео)
- [ ] Страницы "Обучение" и "Профиль" (есть в меню, страниц нет)
- [ ] Обновить Next.js до 15 (4 high CVE остаются в 14.x)

## Как создать нового агента вручную
1. Создать auth user: отредактировать `scripts/create-test-user.mjs`, запустить `node scripts/create-test-user.mjs`
2. Подтвердить email в БД: `UPDATE auth.users SET email_confirmed_at = now() WHERE id = '...'`
3. Добавить запись в `agents`: `INSERT INTO agents (user_id, contact_email, portal_role, status, ...) VALUES (...)`
