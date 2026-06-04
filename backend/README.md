# Backend

Express + TypeScript + Prisma + SQLite API for Quiz Builder.

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Environment

Create `.env`:

```env
DATABASE_URL="file:./dev.db"
PORT=4000
```

## Endpoints

- `POST /quizzes`
- `GET /quizzes`
- `GET /quizzes/:id`
- `DELETE /quizzes/:id`
