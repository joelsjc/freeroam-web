import Link from "next/link";
import type { NewsEvent } from "@/lib/types";
import { ConfidenceBadge } from "./ConfidenceBadge";

function timeAgo(iso?: string): string {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  return `há ${Math.floor(hours / 24)}d`;
}

export function NewsListItem({ event }: { event: NewsEvent }) {
  return (
    <Link
      href={`/news/${event.id}`}
      className="group flex items-start gap-4 py-4 border-b border-base-line px-1 -mx-1 hover:bg-base-raised transition-colors"
    >
      <div className="flex flex-col items-center pt-1 w-14 shrink-0">
        <span className="text-[11px] uppercase text-ink-faint font-medium">{event.category}</span>
      </div>
      {event.imageUrl && (<img src={event.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-16 w-24 shrink-0 rounded border border-base-line object-cover" />)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <ConfidenceBadge confidence={event.confidence} />
          {event.sourceCount ? (
            <span className="text-xs text-ink-faint">{event.sourceCount} fontes</span>
          ) : null}
        </div>
        <h3 className="font-display font-medium text-[15px] text-ink leading-snug group-hover:text-signal transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-ink-dim mt-1 line-clamp-2">{event.summary}</p>
      </div>
      <div className="text-xs text-ink-faint pt-1 shrink-0 tabular-nums">
        {timeAgo(event.detectedAt || event.sourcePublishedAt)}
      </div>
    </Link>
  );
}
