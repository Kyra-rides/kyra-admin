export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 px-8 py-6 border-b border-burgundy-light/60">
      <div>
        <h1 className="font-serif text-2xl text-beige">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-beige-muted max-w-2xl">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}
