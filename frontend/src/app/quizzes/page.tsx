"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

type QuizListItem = {
  id: string;
  title: string;
  questionsCount: number;
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/quizzes`);

        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }

        const data: QuizListItem[] = await response.json();
        setQuizzes(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <p className="text-gray-600">Loading quizzes...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Quizzes</h1>
        <p className="mt-2 text-gray-600">
          Browse all available quizzes and open each one in detail.
        </p>
      </div>

      {quizzes.length === 0 ? (
        <div className="rounded-lg border p-6">
          <p className="text-gray-600">No quizzes yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              href={`/quizzes/${quiz.id}`}
              className="block rounded-lg border p-4 transition hover:bg-gray-50"
            >
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="mt-1 text-sm text-gray-600">
                Questions: {quiz.questionsCount}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
