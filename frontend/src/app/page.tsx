import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Quiz Builder</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Create quizzes and browse your library.
      </p>
      <ul className="mt-8 flex flex-col gap-3 text-sm">
        <li>
          <Link href="/create" className="font-medium underline underline-offset-4">
            Create a quiz
          </Link>
        </li>
        <li>
          <Link href="/quizzes" className="font-medium underline underline-offset-4">
            View all quizzes
          </Link>
        </li>
      </ul>
    </main>
  );
}
