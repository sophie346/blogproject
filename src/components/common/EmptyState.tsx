type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-sm border border-line bg-ink-soft/60 px-6 py-12 text-center sm:px-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-fog">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-fog-muted">
        {message}
      </p>
    </div>
  );
}
