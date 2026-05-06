# Task Manager

Веб-застосунок для управління задачами з канбан-дошкою, побудований на React та Express.js.

**Demo:** [coursework-task-manager.vercel.app](https://coursework-task-manager.vercel.app)

> Перший запит може зайняти до 50 секунд — безкоштовний сервер Render вимикається після 15 хв бездіяльності.

## Можливості

- **Канбан-дошка** — drag & drop перетягування задач між колонками
- **Управління задачами** — створення, редагування, видалення задач
- **Кастомні колонки** — додавання та видалення власних колонок
- **Система тегів** — маркування задач тегами для зручної фільтрації
- **Виконавці** — призначення користувачів на задачі з автопошуком
- **Фільтрація** — фільтри по колонці, виконавцю та тегам
- **Список задач** — альтернативний табличний вигляд усіх задач
- **Аутентифікація** — реєстрація та авторизація через JWT (access + refresh токени)
- **Світла/темна тема** — перемикання між темами
- **Адаптивний дизайн** — мобільне меню та адаптивна верстка
- **Swagger документація** — інтерактивна API документація

## Технології

### Frontend
| Технологія | Призначення |
|---|---|
| React 19 | UI бібліотека |
| React Router 7 | Маршрутизація |
| React Hook Form + Yup | Форми та валідація |
| React Select | Селекти з пошуком |
| @dnd-kit/core | Drag & Drop |
| Axios | HTTP клієнт |
| CSS (Vanilla) | Стилі, glassmorphism, анімації |

### Backend
| Технологія | Призначення |
|---|---|
| Express 5 | Веб-фреймворк |
| Sequelize 6 | ORM для PostgreSQL |
| PostgreSQL 16 | База даних |
| JWT | Аутентифікація (access + refresh) |
| bcryptjs | Хешування паролів |
| Swagger | API документація |

### Інфраструктура
| Технологія | Призначення |
|---|---|
| Docker Compose | Оркестрація контейнерів (локально) |
| Vercel | Хостинг фронтенду |
| Render | Хостинг бекенду |
| Neon | Хмарна PostgreSQL база |
| Nodemon | Hot reload для бекенду |

## Структура проекту

```
coursework-task-manager/
├── docker-compose.yml
├── backend/
│   ├── config/          # Конфігурація БД
│   ├── controllers/     # Контролери (auth, task, column, user)
│   ├── middleware/       # Auth middleware, обробка помилок
│   ├── models/          # Sequelize моделі (User, Task, Tag, Column)
│   ├── routes/          # API маршрути
│   ├── seeders/         # Сідери (дефолтні колонки)
│   ├── service/         # Бізнес-логіка
│   ├── docs/            # Swagger документація
│   └── index.js         # Точка входу
└── frontend/
    └── src/
        ├── api/         # Axios інстанс та сервіси
        ├── components/  # UI компоненти
        │   ├── kanban/      # Канбан-дошка, колонки, картки
        │   ├── tasks/       # Список задач з фільтрами
        │   ├── filters/     # Компонент фільтрів
        │   ├── forms/       # Форми задач
        │   ├── modals/      # Модальні вікна (додати/редагувати/переглянути)
        │   └── navbar/      # Навігація
        ├── context/     # React контексти (Auth, Task, Column, Modal, Toast)
        ├── hooks/       # Кастомні хуки
        ├── layouts/     # Головний layout
        ├── pages/       # Сторінки (Dashboard, Tasks, Landing, Auth)
        ├── routes/      # Маршрутизація, захищені роути
        └── styles/      # Глобальні стилі, кольори, reset
```

## Деплой

Проєкт задеплоєний на безкоштовних хостингах:

| Сервіс | Хостинг | Регіон |
|--------|---------|--------|
| Frontend | Vercel | Edge (автоматично найближчий) |
| Backend | Render | Frankfurt, EU |
| PostgreSQL | Neon | EU (aws-eu-central-1) |

Для найменшого пінгу бекенд і база мають бути **в одному регіоні** (обидва EU). При створенні сервісів обирайте:
- **Render:** Frankfurt (EU Central)
- **Neon:** aws-eu-central-1 (Frankfurt)

## Локальний запуск

### Docker Compose (рекомендовано)

```bash
docker compose up --build
```

Сервіси будуть доступні:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Swagger docs:** http://localhost:5000/api-docs
- **PostgreSQL:** localhost:5432

### Без Docker

#### Передумови
- Node.js 18+
- PostgreSQL 16

#### 1. База даних

Створіть базу даних `task_manager` у PostgreSQL.

#### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Змінні оточення (`backend/.env`):
```env
PORT=5000
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

#### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Змінні оточення (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## API

| Метод | Ендпоінт | Опис |
|-------|----------|------|
| `POST` | `/api/auth/register` | Реєстрація |
| `POST` | `/api/auth/login` | Авторизація |
| `POST` | `/api/auth/logout` | Вихід |
| `POST` | `/api/auth/refresh` | Оновлення токенів |
| `GET`  | `/api/tasks` | Отримати всі задачі |
| `POST` | `/api/tasks` | Створити задачу |
| `PUT`  | `/api/tasks/:id` | Оновити задачу |
| `DELETE` | `/api/tasks/:id` | Видалити задачу |
| `PATCH` | `/api/tasks/:id/status` | Змінити статус задачі |
| `GET`  | `/api/columns` | Отримати колонки |
| `POST` | `/api/columns` | Створити колонку |
| `PUT`  | `/api/columns/:id` | Оновити колонку |
| `DELETE` | `/api/columns/:id` | Видалити колонку |
| `GET`  | `/api/users` | Список користувачів |
| `GET`  | `/api/users/me` | Поточний користувач |

Swagger документація: http://localhost:5000/api-docs
