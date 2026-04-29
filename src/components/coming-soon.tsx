import { PageHeader } from '@/components/page-header';

export function ComingSoon({
  title,
  subtitle,
  bullets,
}: {
  title: string;
  subtitle: string;
  bullets: string[];
}) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="px-8 py-10">
        <div className="max-w-2xl rounded-lg border border-burgundy-light/60 bg-burgundy/60 p-6">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold border border-gold/40 rounded-full px-2.5 py-0.5 mb-4">
            Coming next
          </div>
          <h2 className="font-serif text-xl text-beige mb-3">What this section will hold</h2>
          <ul className="space-y-2 text-sm text-beige-muted">
            {bullets.map((b) => (
              <li key={b} className="flex gap-2">
                <span className="text-gold mt-1">›</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
