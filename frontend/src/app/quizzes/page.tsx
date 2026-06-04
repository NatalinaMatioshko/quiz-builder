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

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
    quizId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const confirmed = window.confirm("Delete this quiz?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete quiz");
      }

      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete quiz.");
    }
  };

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
              className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{quiz.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Questions: {quiz.questionsCount}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(event) => handleDelete(event, quiz.id)}
                  className="rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
