"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, setToken, ApiError } from "@/lib/api";
import { RadarPulse } from "@/components/RadarPulse";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      setToken(res.accessToken);
      router.push("/feed");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível conectar ao radar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-10">
          <RadarPulse size={36} />
          <div>
            <h1 className="font-display font-bold text-lg text-ink leading-none">Freeroam Radar</h1>
            <p className="text-xs text-ink-faint mt-1">Inteligência GTA VI para criadores</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-ink-dim mb-1.5" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-base-raised border border-base-line rounded-sm px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-signal transition-colors"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-dim mb-1.5" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-base-raised border border-base-line rounded-sm px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-signal transition-colors"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-conf-rumor" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-signal text-base font-medium text-sm rounded-sm py-2.5 hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
