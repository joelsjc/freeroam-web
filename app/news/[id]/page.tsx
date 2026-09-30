"use client";

import EventMedia from "../../../components/EventMedia";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchNewsById, getToken, clearToken, ApiError } from "@/lib/api";
import type { NewsEvent } from "@/lib/types";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<NewsEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    fetchNewsById(params.id)
      .then(setEvent)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.push("/login");
          return;
        }
        setError("Não foi possível carregar esse evento.");
      })
      .finally(() => setLoading(false));
  }, [params.id, router]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <Link href="/feed" className="text-xs text-ink-faint hover:text-ink transition-colors">
        ← Voltar ao radar
      </Link>

      {loading && <p className="text-sm text-ink-faint py-12 text-center">Carregando...</p>}

      {!loading && error && <p className="text-sm text-conf-rumor py-12 text-center">{error}</p>}

      {!loading && event && (
        <article className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <ConfidenceBadge confidence={event.confidence} />
            <span className="text-xs uppercase text-ink-faint">{event.category}</span>
          </div>

          <h1 className="font-display font-bold text-2xl text-ink leading-tight mb-4">
            {event.title}
          </h1>

          <EventMedia imageUrl={event.imageUrl} videoUrl={event.videoUrl} title={event.title} />
          <p className="text-sm text-ink-dim leading-relaxed mb-6">{event.summary}</p>

          <dl className="grid grid-cols-2 gap-4 text-xs border-t border-base-line pt-4 mb-6">
            <div>
              <dt className="text-ink-faint mb-1">Detectado em</dt>
              <dd className="text-ink">{formatDate(event.detectedAt)}</dd>
            </div>
            <div>
              <dt className="text-ink-faint mb-1">Publicado pela fonte em</dt>
              <dd className="text-ink">{formatDate(event.sourcePublishedAt)}</dd>
            </div>
          </dl>

          {event.sources && event.sources.length > 0 && (
            <div className="border-t border-base-line pt-4">
              <h2 className="text-xs text-ink-faint mb-3">Fontes ({event.sources.length})</h2>
              <ul className="flex flex-col gap-2">
                {event.sources.map((s) => (
                  <li key={s.id}>
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-signal hover:underline underline-offset-2"
                      >
                        {s.name}
                      </a>
                    ) : (
                      <span className="text-sm text-ink">{s.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}
    </main>
  );
}
