import { ReactNode } from "react";

interface QuestionLayoutProps {
  title: string;
  children: ReactNode;
}

export default function QuestionLayout({
  title,
  children,
}: QuestionLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-lg p-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">
          {title}
        </h1>

        {children}
      </div>
    </main>
  );
}