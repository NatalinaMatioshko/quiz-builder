# Quiz Builder

Full-stack quiz creation platform built as a technical assessment.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Express.js
- TypeScript
- Prisma
- SQLite

## Features

- Create a quiz with multiple question types
- View all quizzes
- View quiz details
- Delete quizzes

## Question Types

- Boolean
- Input
- Checkbox

## Project Structure

```txt
quiz-builder/
├── backend/
├── frontend/
└── README.md
```

## Setup

### 1. Clone repository

```bash
git clone <repo-url>
cd quiz-builder
```

### 2. Backend setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Backend runs on:

```txt
http://localhost:4000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

## Environment Variables

### backend/.env

```env
DATABASE_URL="file:./dev.db"
PORT=4000
```

### frontend/.env.local

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## API Endpoints

- `POST /quizzes`
- `GET /quizzes`
- `GET /quizzes/:id`
- `DELETE /quizzes/:id`
