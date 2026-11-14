"use client";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <p className="text-sm text-ink mb-3">Erro nesta página:</p>
      <pre className="text-xs text-conf-rumor whitespace-pre-wrap break-words">
        {error.message}
        {"\n"}
        {error.stack}
      </pre>
      <button onClick={reset} className="text-xs text-signal underline mt-4">
        Tentar de novo
      </button>
    </main>
  );
}
