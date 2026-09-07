export function RadarPulse({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" stroke="#20242E" strokeWidth="1.5" />
      <circle cx="20" cy="20" r="12" stroke="#20242E" strokeWidth="1" />
      <circle cx="20" cy="20" r="6" stroke="#20242E" strokeWidth="1" />
      <g className="origin-[20px_20px] animate-sweep">
        <path
          d="M20 20 L20 2 A18 18 0 0 1 34.7 11 Z"
          fill="url(#sweepGradient)"
        />
      </g>
      <circle cx="20" cy="20" r="2" fill="#FFB020" />
      <defs>
        <linearGradient id="sweepGradient" x1="20" y1="2" x2="34.7" y2="11" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB020" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFB020" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
