"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

type Question = {
  id: string;
  type: string;
  label: string;
  options: string[] | null;
};

type QuizDetails = {
  id: string;
  title: string;
  questions: Question[];
};

export default function QuizDetailsPage() {
  const params = useParams<{ id: string }>();
  const quizId = params.id;

  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }

        const data: QuizDetails = await response.json();
        setQuiz(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz details");
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  if (loading) {
    return <p className="text-gray-600">Loading quiz details...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!quiz) {
    return <p className="text-gray-600">Quiz not found.</p>;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{quiz.title}</h1>
        <p className="mt-2 text-gray-600">
          This page shows the quiz structure in read-only mode.
        </p>
      </div>

      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="rounded-lg border p-4">
            <p className="text-sm text-gray-500">
              Question {index + 1} · {question.type}
            </p>

            <h2 className="mt-2 text-lg font-semibold">{question.label}</h2>

            {question.type === "BOOLEAN" && (
              <div className="mt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="radio" disabled />
                  True
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="radio" disabled />
                  False
                </label>
              </div>
            )}

            {question.type === "INPUT" && (
              <input
                type="text"
                disabled
                placeholder="Short text answer"
                className="mt-3 w-full rounded-md border px-3 py-2 text-sm"
              />
            )}

            {question.type === "CHECKBOX" && (
              <div className="mt-3 space-y-2">
                {question.options?.map((option, optionIndex) => (
                  <label
                    key={`${question.id}-${optionIndex}`}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <input type="checkbox" disabled />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
