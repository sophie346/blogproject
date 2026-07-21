/**
 * Modern hero illustration — colors follow theme tokens so light and dark
 * tenants both get a coherent product-UI mock.
 */
export function HeroIllustration() {
  return (
    <svg
      className="hero-illustration block h-auto w-full drop-shadow-[0_24px_60px_rgba(11,10,18,0.12)]"
      viewBox="0 0 520 440"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ink-soft)" />
          <stop offset="100%" stopColor="var(--ink)" />
        </linearGradient>
        <linearGradient id="hero-block" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--amber-soft)" />
          <stop offset="100%" stopColor="var(--amber)" />
        </linearGradient>
        <linearGradient id="hero-accent" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--amber)" />
          <stop offset="100%" stopColor="var(--amber-soft)" />
        </linearGradient>
      </defs>

      <rect
        x="28"
        y="32"
        width="464"
        height="376"
        rx="28"
        fill="url(#hero-panel)"
        stroke="var(--line)"
        strokeWidth="1.5"
      />

      {/* Left feature tile */}
      <rect x="56" y="60" width="200" height="200" rx="20" fill="url(#hero-block)" />
      <rect x="80" y="108" width="84" height="10" rx="5" fill="#ffffff" opacity="0.95" />
      <rect x="80" y="132" width="130" height="8" rx="4" fill="#ffffff" opacity="0.45" />
      <rect x="80" y="152" width="100" height="8" rx="4" fill="#ffffff" opacity="0.28" />
      <rect x="80" y="200" width="56" height="28" rx="10" fill="#ffffff" opacity="0.92" />

      {/* Right stack */}
      <rect
        x="276"
        y="60"
        width="188"
        height="88"
        rx="16"
        fill="var(--ink-soft)"
        stroke="var(--line)"
      />
      <rect x="296" y="86" width="96" height="10" rx="5" fill="var(--fog)" opacity="0.85" />
      <rect x="296" y="110" width="140" height="8" rx="4" fill="var(--fog-muted)" opacity="0.7" />

      <rect
        x="276"
        y="164"
        width="188"
        height="88"
        rx="16"
        fill="var(--ink-soft)"
        stroke="var(--line)"
      />
      <rect x="296" y="190" width="72" height="10" rx="5" fill="var(--fog)" opacity="0.85" />
      <rect x="296" y="214" width="128" height="8" rx="4" fill="var(--fog-muted)" opacity="0.7" />

      {/* Chart / pulse */}
      <path
        d="M56 300 C110 262, 150 338, 210 300 C270 262, 318 342, 380 298 C416 274, 440 310, 456 286"
        stroke="url(#hero-accent)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 336 C118 304, 160 364, 224 332 C288 300, 330 372, 404 330"
        stroke="var(--fog-muted)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.55"
      />

      <circle
        cx="412"
        cy="352"
        r="48"
        fill="none"
        stroke="var(--amber)"
        strokeWidth="2.5"
        opacity="0.85"
      />
      <circle cx="412" cy="352" r="18" fill="var(--amber)" />
      <circle cx="80" cy="372" r="5" fill="var(--amber)" />
      <circle cx="102" cy="372" r="5" fill="var(--amber-soft)" />
      <circle cx="124" cy="372" r="5" fill="var(--amber)" opacity="0.55" />
    </svg>
  );
}
