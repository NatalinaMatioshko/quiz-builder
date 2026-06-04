import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz Builder",
  description: "Full-stack quiz builder test task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <Link href="/" className="font-semibold">
              Quiz Builder
            </Link>
            <Link
              href="/quizzes"
              className="text-sm text-gray-600 hover:text-black"
            >
              All Quizzes
            </Link>
            <Link
              href="/create"
              className="text-sm text-gray-600 hover:text-black"
            >
              Create Quiz
            </Link>
          </nav>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
