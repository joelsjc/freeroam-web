"use client";

import { useEffect, useState } from "react";

type Props = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  title: string;
};

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  return m ? m[1] : null;
}

const btn =
  "inline-flex items-center gap-2 rounded border border-base-line bg-base-raised px-4 py-2 text-sm text-ink";

export default function EventMedia({ imageUrl, videoUrl, title }: Props) {
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [embeddable, setEmbeddable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!videoUrl) return;
    const id = youtubeId(videoUrl);
    if (!id) return;
    let cancelled = false;
    fetch(
      "https://www.youtube.com/oembed?format=json&url=" +
        encodeURIComponent("https://www.youtube.com/watch?v=" + id)
    )
      .then((r) => {
        if (!cancelled) setEmbeddable(r.ok);
      })
      .catch(() => {
        if (!cancelled) setEmbeddable(null);
      });
    return () => {
      cancelled = true;
    };
  }, [videoUrl]);

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement("textarea");
      t.value = url;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function onPlay(url: string) {
    if (embeddable === false) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      setPlaying(true);
    }
  }

  if (videoUrl) {
    const yt = youtubeId(videoUrl);
    if (yt) {
      const cover = imageUrl || "https://i.ytimg.com/vi/" + yt + "/hqdefault.jpg";
      return (
        <div className="mb-5 max-w-md">
          <div className="relative aspect-video w-full overflow-hidden rounded border border-base-line bg-black">
            {playing ? (
              <iframe
                src={"https://www.youtube-nocookie.com/embed/" + yt + "?autoplay=1&rel=0"}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                onClick={() => onPlay(videoUrl)}
                className="group relative h-full w-full"
                aria-label="Reproduzir video"
              >
                <img
                  src={cover}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-black/70 text-2xl text-white">
                    ▶
                  </span>
                </span>
              </button>
            )}
          </div>
          {embeddable === false ? (
            <p className="mt-2 text-xs text-ink-faint">
              {"Este v\u00eddeo tem restri\u00e7\u00e3o de idade e s\u00f3 toca no YouTube."}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-3">
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={btn}>
              Abrir no YouTube
            </a>
            <button type="button" onClick={() => copyLink(videoUrl)} className={btn}>
              {copied ? "Link copiado!" : "Copiar link"}
            </button>
          </div>
        </div>
      );
    }
    if (/\.(mp4|webm)(\?|$)/i.test(videoUrl)) {
      return (
        <video
          src={videoUrl}
          poster={imageUrl ?? undefined}
          controls
          className="mb-5 w-full rounded border border-base-line"
        />
      );
    }
  }
  if (imageUrl) {
    return (
      <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block">
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="mb-5 max-h-96 w-full rounded border border-base-line object-cover"
        />
      </a>
    );
  }
  return null;
}
