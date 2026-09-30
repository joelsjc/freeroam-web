"use client";

import { useEffect, useState } from "react";
import { fetchNews, ApiError } from "@/lib/api";
import type { NewsEvent } from "@/lib/types";
import { NewsListItem } from "@/components/NewsListItem";
import { RadarPulse } from "@/components/RadarPulse";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNews();
      setEvents(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <RadarPulse size={32} />
        <div>
          <h1 className="font-display font-bold text-lg text-ink leading-none">Eventos</h1>
          <p className="text-xs text-ink-faint mt-1">Painel admin — Freeroam Radar</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-conf-rumor mb-4" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-ink-dim">Carregando...</p>
      ) : (
        <div className="flex flex-col">
          {events.map((event) => (
            <NewsListItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </main>
  );
}
