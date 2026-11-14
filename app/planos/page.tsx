import Link from 'next/link';

async function getPlans() {
  try {
    const res = await fetch('http://localhost:3010/api/v1/plans', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}

export default async function PlansPage() {
  const plans = await getPlans();
  
  // Filtra apenas os planos mensais para exibir os cards principais
  const monthlyPlans = plans.filter((p: any) => p.cycle === 'monthly');

  return (
    <div className="min-h-screen bg-[#0B0B14] text-[#F2F2F7] p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <Link href="/servidores" className="text-[#00E5FF] hover:underline mb-6 inline-block">
            ← Voltar para Servidores
          </Link>
          <h1 className="text-5xl font-bold mb-4">
            Escolha seu <span className="text-[#FF2E88]">Plano</span>
          </h1>
          <p className="text-[#8E8EA3] text-lg max-w-2xl mx-auto">
            Desbloqueie o diretório completo, acesse guias exclusivos e prepare-se para o lançamento de GTA 6.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {monthlyPlans.map((plan: any, index: number) => {
            const isPopular = plan.tier === 'vip';
            const priceFormatted = (plan.priceCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            return (
              <div 
                key={plan.id} 
                className={`relative bg-[#14141F] rounded-2xl p-8 border ${
                  isPopular ? 'border-[#FF2E88] shadow-[0_0_30px_rgba(255,46,136,0.15)] transform scale-105' : 'border-white/10'
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF2E88] text-white text-sm font-bold px-4 py-1 rounded-full">
                    Mais Popular
                  </div>
                )}

                <h2 className="text-3xl font-bold text-center mb-2 capitalize">{plan.name.replace('Mensal', '')}</h2>
                <div className="text-center mb-8">
                  <span className="text-4xl font-bold text-[#00E5FF]">{priceFormatted}</span>
                  <span className="text-[#8E8EA3]">/mês</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {Object.entries(plan.benefits).map(([key, value]) => {
                    if (!value) return null;
                    const labels: any = {
                      radar: 'Acesso total ao Radar',
                      servers: 'Lista completa de servidores',
                      premium_guides: 'Guias premium de allowlist',
                      featured: 'Servidor em destaque e estatísticas'
                    };
                    return (
                      <li key={key} className="flex items-start gap-3 text-sm text-[#F2F2F7]">
                        <span className="text-[#00E5FF] text-lg font-bold">✓</span>
                        {labels[key] || key}
                      </li>
                    );
                  })}
                </ul>

                <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isPopular 
                    ? 'bg-gradient-to-r from-[#FF2E88] to-[#00E5FF] text-[#0B0B14] hover:opacity-90' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                }`}>
                  Assinar {plan.name.replace('Mensal', '')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
