/** High-contrast editorial illustration for the modern hero. */
export function HeroIllustration() {
  return (
    <svg
      className="hero-illustration block h-auto w-full drop-shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      viewBox="0 0 520 440"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="hero-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#141414" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id="hero-block" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff4d5a" />
          <stop offset="100%" stopColor="#e11d2e" />
        </linearGradient>
      </defs>

      <rect
        x="28"
        y="32"
        width="464"
        height="376"
        rx="32"
        fill="url(#hero-panel)"
        stroke="#2a2a2a"
        strokeWidth="1.5"
      />

      <rect x="64" y="68" width="176" height="176" rx="22" fill="url(#hero-block)" />
      <rect x="88" y="118" width="72" height="10" rx="5" fill="#ffffff" opacity="0.9" />
      <rect x="88" y="140" width="112" height="8" rx="4" fill="#ffffff" opacity="0.35" />
      <rect x="88" y="158" width="88" height="8" rx="4" fill="#ffffff" opacity="0.22" />

      <rect
        x="264"
        y="68"
        width="188"
        height="78"
        rx="16"
        fill="#161616"
        stroke="#3a3a3a"
      />
      <rect x="284" y="92" width="100" height="10" rx="5" fill="#ffffff" />
      <rect x="284" y="114" width="148" height="8" rx="4" fill="#777777" />

      <rect
        x="264"
        y="162"
        width="188"
        height="78"
        rx="16"
        fill="#161616"
        stroke="#3a3a3a"
      />
      <rect x="284" y="186" width="76" height="10" rx="5" fill="#ffffff" />
      <rect x="284" y="208" width="132" height="8" rx="4" fill="#777777" />

      <path
        d="M64 292 C118 248, 162 334, 224 292 C286 250, 328 338, 388 294 C424 268, 444 304, 456 282"
        stroke="#ff4d5a"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M64 328 C126 292, 168 356, 232 324 C296 292, 336 368, 408 324"
        stroke="#555555"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      <circle cx="408" cy="348" r="52" fill="none" stroke="#e11d2e" strokeWidth="2.5" />
      <circle cx="408" cy="348" r="20" fill="#e11d2e" />
      <circle cx="88" cy="368" r="5" fill="#ff4d5a" />
      <circle cx="110" cy="368" r="5" fill="#ff4d5a" />
      <circle cx="132" cy="368" r="5" fill="#ff4d5a" />
    </svg>
  );
}
