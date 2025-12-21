# N1 Capital - Agent Portal

Партнёрский портал для агентов N1 Capital.

## Tech Stack

- Next.js 14
- Supabase (Auth + Database)
- Vercel

## Структура

```
app/
├── page.js              # Лендинг
├── login/               # Страница входа
├── api/auth/            # API аутентификации
└── dashboard/           # Личный кабинет (защищённый)
    ├── page.js          # Главная dashboard
    ├── products/        # Витрина продуктов
    ├── sales/           # Мои продажи
    └── commissions/     # Комиссии
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Development

```bash
npm install
npm run dev
```

## Deployment

Автоматический деплой через Vercel при push в main.
