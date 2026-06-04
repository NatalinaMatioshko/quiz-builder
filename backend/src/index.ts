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

app.get("/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("GET /quizzes/:id failed:", error);
    res.status(500).json({ message: "Failed to fetch quiz details" });
  }
});

app.post("/quizzes", async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Quiz title is required" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one question is required" });
    }

    const createdQuiz = await prisma.quiz.create({
      data: {
        title,
        questions: {
          create: questions.map(
            (question: { type: string; label: string; options?: unknown }) => ({
              type: question.type,
              label: question.label,
              options: question.options ?? null,
            }),
          ),
        },
      },
      include: {
        questions: true,
      },
    });

    res.status(201).json(createdQuiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ message: "Failed to create quiz" });
  }
});

app.delete("/quizzes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingQuiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!existingQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await prisma.quiz.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("DELETE /quizzes/:id failed:", error);
    res.status(500).json({ message: "Failed to delete quiz" });
  }
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
