type Props = {
  imageUrl?: string | null;
  videoUrl?: string | null;
  title: string;
};

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  return m ? m[1] : null;
}

export default function EventMedia({ imageUrl, videoUrl, title }: Props) {
  if (videoUrl) {
    const yt = youtubeId(videoUrl);
    if (yt) {
      return (
        <div className="mb-5 aspect-video w-full overflow-hidden rounded border border-base-line bg-black">
          <iframe
            src={"https://www.youtube-nocookie.com/embed/" + yt}
            title={title}
            className="h-full w-full"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
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
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="mb-5 max-h-96 w-full rounded border border-base-line object-cover"
      />
    );
  }
  return null;
}
