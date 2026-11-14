import Link from 'next/link';
import { cookies } from 'next/headers';

async function getServers() {
  try {
    const res = await fetch('http://localhost:3010/api/v1/servers', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function ServersPage() {
  const servers = await getServers();
  
  // Lê o cookie para saber quem está logado (simulação)
  const cookieStore = cookies();
  const simulatedRole = cookieStore.get('simulated_role')?.value || 'visitor';
  
  // Visitante só vê 5. Qualquer outro plano vê tudo.
  const isVisitor = simulatedRole === 'visitor';

  return (
    <div className="min-h-screen bg-[#0B0B14] text-[#F2F2F7] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#FF2E88] to-[#00E5FF] bg-clip-text text-transparent">
            Diretório de Servidores
          </h1>
          <p className="text-[#8E8EA3] text-lg">
            Encontre o servidor perfeito para viver sua história no RP.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server: any, index: number) => {
            const isLocked = isVisitor && index >= 5; // Bloqueia após o 5º apenas para visitantes

            return (
              <div key={server.id} className="relative group">
                <div className={`bg-[#14141F] border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-[#00E5FF] hover:shadow-[0_0_20px_rgba(0,229,255,0.2)] ${isLocked ? 'blur-[6px] select-none opacity-50' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">{server.name}</h2>
                    <span className="bg-[#FFB300]/20 text-[#FFB300] px-2 py-1 rounded text-sm font-bold flex items-center gap-1">
                      ★ {server.ratingAvg.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[#8E8EA3] text-sm mb-6 line-clamp-3">
                    {server.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {server.tags.map((tag: string) => (
                      <span key={tag} className="text-xs bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-1 rounded-full border border-[#00E5FF]/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-[#8E8EA3]">
                    <span>{server.country} • {server.status.replace('_', ' ')}</span>
                    <span>{server.allowlist ? 'Com Whitelist' : 'Entrada Livre'}</span>
                  </div>
                </div>

                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="bg-[#14141F] p-4 rounded-full mb-4 border border-[#FF2E88] shadow-[0_0_15px_rgba(255,46,136,0.4)]">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <p className="text-center px-4 font-bold text-white mb-4">Exclusivo para assinantes</p>
                    <Link href="/planos" className="bg-gradient-to-r from-[#FF2E88] to-[#00E5FF] text-[#0B0B14] font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity">
                      Desbloquear Lista
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
