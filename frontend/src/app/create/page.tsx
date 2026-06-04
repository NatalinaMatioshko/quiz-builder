"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

type QuestionForm = {
  type: QuestionType;
  label: string;
  options: string[];
};

const createEmptyQuestion = (): QuestionForm => ({
  type: "BOOLEAN",
  label: "",
  options: ["", ""],
});

export default function CreateQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([
    createEmptyQuestion(),
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleQuestionChange = (
    index: number,
    field: keyof QuestionForm,
    value: string | string[],
  ) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question,
      ),
    );
  };

  const handleTypeChange = (index: number, type: QuestionType) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              type,
              options: type === "CHECKBOX" ? ["", ""] : [],
            }
          : question,
      ),
    );
  };

  const handleOptionChange = (
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions((prev) =>
      prev.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) {
          return question;
        }

        const updatedOptions = [...question.options];
        updatedOptions[optionIndex] = value;

        return {
          ...question,
          options: updatedOptions,
        };
      }),
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, createEmptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) =>
      prev.filter((_, questionIndex) => questionIndex !== index),
    );
  };

  const addOption = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, currentQuestionIndex) =>
        currentQuestionIndex === questionIndex
          ? { ...question, options: [...question.options, ""] }
          : question,
      ),
    );
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((question, currentQuestionIndex) => {
        if (currentQuestionIndex !== questionIndex) {
          return question;
        }

        return {
          ...question,
          options: question.options.filter(
            (_, currentOptionIndex) => currentOptionIndex !== optionIndex,
          ),
        };
      }),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Quiz title is required.");
      return;
    }

    if (questions.length === 0) {
      setError("Add at least one question.");
      return;
    }

    for (const question of questions) {
      if (!question.label.trim()) {
        setError("Each question must have a label.");
        return;
      }

      if (question.type === "CHECKBOX") {
        const filledOptions = question.options.filter(
          (option) => option.trim() !== "",
        );

        if (filledOptions.length < 2) {
          setError("Checkbox questions must have at least two options.");
          return;
        }
      }
    }

    const payload = {
      title: title.trim(),
      questions: questions.map((question) => ({
        type: question.type,
        label: question.label.trim(),
        options:
          question.type === "CHECKBOX"
            ? question.options.filter((option) => option.trim() !== "")
            : null,
      })),
    };

    try {
      setSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      router.push("/quizzes");
    } catch (err) {
      console.error(err);
      setError("Failed to create quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Quiz</h1>
        <p className="mt-2 text-gray-600">
          Build a quiz with boolean, input, and checkbox questions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <label className="mb-2 block text-sm font-medium">Quiz title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter quiz title"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-4">
          {questions.map((question, questionIndex) => (
            <div
              key={questionIndex}
              className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold">
                  Question {questionIndex + 1}
                </h2>
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  disabled={questions.length === 1}
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Question type
                </label>
                <select
                  value={question.type}
                  onChange={(event) =>
                    handleTypeChange(
                      questionIndex,
                      event.target.value as QuestionType,
                    )
                  }
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="BOOLEAN">Boolean</option>
                  <option value="INPUT">Input</option>
                  <option value="CHECKBOX">Checkbox</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Question label
                </label>
                <input
                  type="text"
                  value={question.label}
                  onChange={(event) =>
                    handleQuestionChange(
                      questionIndex,
                      "label",
                      event.target.value,
                    )
                  }
                  placeholder="Enter question text"
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>

              {question.type === "BOOLEAN" && (
                <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                  This question will be shown as True / False radio buttons.
                </div>
              )}

              {question.type === "INPUT" && (
                <div className="rounded-md bg-gray-50 p-3">
                  <input
                    type="text"
                    disabled
                    placeholder="Short text answer"
                    className="w-full rounded-md border px-3 py-2 text-sm bg-white"
                  />
                </div>
              )}

              {question.type === "CHECKBOX" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(event) =>
                            handleOptionChange(
                              questionIndex,
                              optionIndex,
                              event.target.value,
                            )
                          }
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 rounded-md border px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            removeOption(questionIndex, optionIndex)
                          }
                          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                          disabled={question.options.length === 2}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addOption(questionIndex)}
                    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    Add option
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addQuestion}
            className="rounded-md border px-4 py-2 hover:bg-gray-50"
          >
            Add question
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create quiz"}
          </button>
        </div>
      </form>
    </section>
  );
}
