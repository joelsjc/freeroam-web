'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao criar usuário.');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B14] text-[#F2F2F7] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-[#14141F] p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Criar Conta</h1>
          <p className="text-[#8E8EA3]">Entre para o Freeroam Radar</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8E8EA3] mb-1">Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0B0B14] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF2E88] transition-colors"
              placeholder="Seu nome"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#8E8EA3] mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0B0B14] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF2E88] transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[#8E8EA3] mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0B0B14] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF2E88] transition-colors"
              placeholder="Crie uma senha forte"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF2E88] to-[#00E5FF] text-[#0B0B14] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity mt-6 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#8E8EA3]">
          Já tem conta? <Link href="/login" className="text-[#00E5FF] hover:underline">Fazer login</Link>
        </div>
      </div>
    </div>
  );
}
