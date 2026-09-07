"use client";

const CATEGORIES = ["Todas", "trailer", "gameplay", "mapa", "personagens", "lançamento"];
const CONFIDENCES = [
  { value: "", label: "Todas" },
  { value: "official", label: "Oficial" },
  { value: "multi_source", label: "Múltiplas fontes" },
  { value: "probable", label: "Provável" },
  { value: "rumor", label: "Rumor" },
];

interface Props {
  category: string;
  confidence: string;
  search: string;
  onCategoryChange: (v: string) => void;
  onConfidenceChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

export function FilterBar({
  category,
  confidence,
  search,
  onCategoryChange,
  onConfidenceChange,
  onSearchChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-base-line">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar no radar..."
        className="w-full bg-base-raised border border-base-line rounded-sm px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-signal transition-colors"
      />
      <div className="flex items-center gap-2 overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const value = cat === "Todas" ? "" : cat;
          const active = category === value;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(value)}
              className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-colors ${
                active
                  ? "border-signal text-signal bg-signal-soft"
                  : "border-base-line text-ink-dim hover:text-ink"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {CONFIDENCES.map((c) => {
          const active = confidence === c.value;
          return (
            <button
              key={c.label}
              onClick={() => onConfidenceChange(c.value)}
              className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap transition-colors ${
                active
                  ? "border-signal text-signal bg-signal-soft"
                  : "border-base-line text-ink-dim hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
