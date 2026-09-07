import type { NewsConfidence } from "@/lib/types";

const CONFIG: Record<NewsConfidence, { label: string; color: string }> = {
  official: { label: "Oficial", color: "#3ED598" },
  multi_source: { label: "Múltiplas fontes", color: "#4C9AFF" },
  probable: { label: "Provável", color: "#E8C23A" },
  rumor: { label: "Rumor", color: "#E8813A" },
  leak: { label: "Vazamento", color: "#B478F0" },
  unverified: { label: "Não verificado", color: "#5C616D" },
};

export function ConfidenceBadge({ confidence }: { confidence: NewsConfidence }) {
  const cfg = CONFIG[confidence] ?? CONFIG.unverified;
  const isLive = confidence === "official" || confidence === "multi_source";

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium tracking-normal"
      style={{ color: cfg.color }}
    >
      <span
        className={`inline-block w-2 h-2 rounded-full ${isLive ? "animate-pulse_dot" : ""}`}
        style={{ backgroundColor: cfg.color }}
      />
      {cfg.label}
    </span>
  );
}
