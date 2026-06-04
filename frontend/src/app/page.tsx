import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Quiz Builder</h1>
      <p className="max-w-2xl text-gray-600">
        Create quizzes with boolean, input, and checkbox questions. View all
        quizzes and open each one in a separate details page.
      </p>

      <div className="flex gap-4">
        <Link
          href="/quizzes"
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          View quizzes
        </Link>
        <Link
          href="/create"
          className="rounded-md border px-4 py-2 hover:bg-gray-50"
        >
          Create quiz
        </Link>
      </div>
    </section>
  );
}
