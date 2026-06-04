import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { prisma } from "./prisma.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/quizzes", async (_req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        questionsCount: quiz._count.questions,
      })),
    );
  } catch (error) {
    console.error("GET /quizzes failed:", error);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
