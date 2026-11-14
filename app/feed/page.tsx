"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { fetchNews, getToken, clearToken, ApiError } from "@/lib/api";
import type { NewsEvent } from "@/lib/types";
import { NewsListItem } from "@/components/NewsListItem";
import { FilterBar } from "@/components/FilterBar";
import { RadarPulse } from "@/components/RadarPulse";

const PAGE_SIZE = 30;

export default function FeedPage() {
  const router = useRouter();
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [confidence, setConfidence] = useState("");
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNews({ category, confidence, search, limit: PAGE_SIZE, offset: 0 });
      setEvents(data);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken();
        router.push("/login");
        return;
      }
      setError("Não foi possível carregar o radar agora.");
    } finally {
      setLoading(false);
    }
  }, [category, confidence, search, router]);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    load();
  }, [load, router]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const data = await fetchNews({ category, confidence, search, limit: PAGE_SIZE, offset: events.length });
      setEvents((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <RadarPulse size={28} />
          <h1 className="font-display font-bold text-base bg-gradient-to-r from-[#FF2E88] via-white to-[#00E5FF] bg-clip-text text-transparent">Freeroam Radar</h1>
        </div>
        <button onClick={handleLogout} className="text-xs text-ink-faint hover:text-ink transition-colors">
          Sair
        </button>
      </header>

      <FilterBar
        category={category}
        confidence={confidence}
        search={search}
        onCategoryChange={setCategory}
        onConfidenceChange={setConfidence}
        onSearchChange={setSearch}
      />

      <section className="mt-2">
        {loading && <p className="text-sm text-ink-faint py-8 text-center">Varrendo o radar...</p>}

        {!loading && error && (
          <div className="py-8 text-center">
            <p className="text-sm text-conf-rumor mb-3">{error}</p>
            <button onClick={load} className="text-xs text-signal underline underline-offset-2">
              Tentar de novo
            </button>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="text-sm text-ink-faint py-8 text-center">
            Nenhum sinal encontrado com esses filtros.
          </p>
        )}

        {!loading &&
          !error &&
          events.map((event) => <NewsListItem key={event.id} event={event} />)}

        {!loading && !error && hasMore && (
          <button onClick={loadMore} disabled={loadingMore} className="w-full mt-4 py-3 text-sm text-signal border border-base-line rounded hover:bg-base-raised transition-colors">
            {loadingMore ? "Carregando..." : "Carregar mais"}
          </button>
        )}
      </section>
    </main>
  );
}
