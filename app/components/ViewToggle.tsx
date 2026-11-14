'use client';

import { useState, useEffect } from 'react';

export default function ViewToggle() {
  const [currentView, setCurrentView] = useState('visitor');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Pega a visão atual dos cookies
    const match = document.cookie.match(/(^| )simulated_role=([^;]+)/);
    if (match) setCurrentView(match[2]);
  }, []);

  const changeView = (role: string) => {
    document.cookie = `simulated_role=${role}; path=/`;
    setCurrentView(role);
    setIsOpen(false);
    window.location.reload(); // Recarrega para o servidor ler o novo cookie
  };

  const views = [
    { id: 'visitor', label: 'Visitante' },
    { id: 'citizen', label: 'Cidadão (R$ 29,90)' },
    { id: 'vip', label: 'VIP (R$ 199,90)' },
    { id: 'founder', label: 'Fundador (R$ 399,90)' },
    { id: 'admin', label: 'Admin (Total)' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-[#14141F] border border-white/10 rounded-xl p-2 mb-4 shadow-2xl flex flex-col gap-1 w-56">
          <div className="text-xs text-[#8E8EA3] text-center mb-2 px-2">Simular Visualização:</div>
          {views.map(v => (
            <button 
              key={v.id}
              onClick={() => changeView(v.id)}
              className={`text-left px-4 py-2 text-sm rounded-lg transition-colors ${currentView === v.id ? 'bg-[#FF2E88]/20 text-[#FF2E88] font-bold' : 'text-white hover:bg-white/5'}`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-[#FF2E88] to-[#00E5FF] text-[#0B0B14] font-bold px-6 py-3 rounded-full shadow-[0_0_20px_rgba(255,46,136,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
      >
        <span>👁️</span> Ver como: {views.find(v => v.id === currentView)?.label.split(' ')[0]}
      </button>
    </div>
  );
}
