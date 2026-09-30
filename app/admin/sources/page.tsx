"use client";

import { useEffect, useState } from "react";
import { fetchSources, updateSource, ApiError } from "@/lib/api";
import type { NewsSource } from "@/lib/types";
import { RadarPulse } from "@/components/RadarPulse";

export default function AdminSourcesPage() {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSources();
      setSources(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar as fontes.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(source: NewsSource) {
    setSavingId(source.id);
    try {
      const updated = await updateSource(source.id, { active: !source.active });
      setSources((prev) => prev.map((s) => (s.id === source.id ? updated : s)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Falha ao atualizar fonte.");
    } finally {
      setSavingId(null);
    }
  }

  async function updateTrust(source: NewsSource, value: number) {
    setSavingId(source.id);
    try {
      const updated = await updateSource(source.id, { trustWeight: value });
      setSources((prev) => prev.map((s) => (s.id === source.id ? updated : s)));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Falha ao atualizar fonte.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <RadarPulse size={32} />
        <div>
          <h1 className="font-display font-bold text-lg text-ink leading-none">Fontes</h1>
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
        <div className="flex flex-col gap-3">
          {sources.map((source) => (
            <div
              key={source.id}
              className="bg-base-raised border border-base-line rounded-sm p-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm text-ink font-medium truncate">{source.name}</p>
                <p className="text-xs text-ink-faint truncate">{source.url}</p>
                <p className="text-xs text-ink-dim mt-1">
                  confiança {source.trustWeight} · prioridade {source.priority} · {source.collectionMethod}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <input
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={source.trustWeight}
                  disabled={savingId === source.id}
                  onBlur={(e) => {
                    const value = Number(e.target.value);
                    if (value !== source.trustWeight) updateTrust(source, value);
                  }}
                  className="w-16 bg-base border border-base-line rounded-sm px-2 py-1 text-xs text-ink"
                />
                <button
                  onClick={() => toggleActive(source)}
                  disabled={savingId === source.id}
                  className={`text-xs font-medium rounded-sm px-3 py-1.5 transition-opacity disabled:opacity-50 ${
                    source.active ? "bg-signal text-base" : "bg-base border border-base-line text-ink-dim"
                  }`}
                >
                  {source.active ? "Ativa" : "Inativa"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
