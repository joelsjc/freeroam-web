"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { setToken } from "../../lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- O Olhinho
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }
    try {
      const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (d.accessToken) setToken(d.accessToken);
    } catch {}
    router.push("/feed");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <h1 className="font-display font-bold text-4xl mb-2 text-center bg-gradient-to-r from-[#FF2E88] via-white to-[#00E5FF] bg-clip-text text-transparent">Freeroam Radar</h1>
      <p className="text-ink-faint text-sm text-center mb-8">Inteligência GTA VI para criadores</p>
      {justRegistered && (
        <p className="text-secondary text-sm text-center mb-4 bg-secondary/10 border border-secondary/20 rounded-lg p-2">
          ✅ Conta criada! Faça login para continuar.
        </p>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-sm text-ink-faint block mb-1">E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-ink focus:border-primary outline-none transition" placeholder="seu@email.com" />
        </div>
        <div>
          <label className="text-sm text-ink-faint block mb-1">Senha</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              className="w-full bg-surface border border-white/10 rounded-lg px-4 py-2 text-ink focus:border-primary outline-none transition pr-12" 
              placeholder="Sua senha" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink text-sm"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-base font-bold hover:opacity-90 transition disabled:opacity-50">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="text-center text-sm text-ink-faint mt-6">
        Não tem conta?{" "}
        <Link href="/register" className="text-secondary underline">Criar agora</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="login-bg min-h-screen text-ink flex items-center justify-center px-4">
      <Suspense fallback={<p className="text-ink-faint">Carregando...</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
