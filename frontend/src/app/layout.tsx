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
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
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
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
