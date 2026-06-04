type QuizPageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold">Quiz</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Viewing quiz <span className="font-mono text-foreground">{id}</span>.
      </p>
    </main>
  );
}
