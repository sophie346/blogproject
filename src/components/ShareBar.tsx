"use client";

import { useState } from "react";

type ShareBarProps = {
  title: string;
  url: string;
};

export function ShareBar({ title, url }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="font-display text-xs uppercase tracking-[0.18em] text-fog-muted">
        Share
      </span>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className="font-display text-sm text-steel-bright transition-colors hover:text-amber-soft"
      >
        X / Twitter
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
        className="font-display text-sm text-steel-bright transition-colors hover:text-amber-soft"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="font-display text-sm text-steel-bright transition-colors hover:text-amber-soft"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
