import Link from 'next/link';

import { PageHeader } from '@/components/page-header';
import { INCIDENTS, KPIS, LIVE_RIDES, ONBOARDING_QUEUE } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Operations dashboard"
        subtitle="Today at a glance — live rides, fleet status, and anything that needs your attention."
      />

      <div className="px-8 py-6 space-y-8">
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <Kpi label="Online drivers" value={KPIS.onlineDrivers} accent="success" />
          <Kpi label="Rides in progress" value={KPIS.ridesInProgress} accent="gold" />
          <Kpi label="Completed today" value={KPIS.completedToday} />
          <Kpi label="Revenue today" value={`₹${KPIS.revenueTodayInr.toLocaleString('en-IN')}`} />
          <Kpi label="Open incidents" value={KPIS.openIncidents} accent="danger" />
          <Kpi label="Pending approvals" value={KPIS.pendingApprovals} accent="gold" />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel title="Live rides" link={{ href: '/live-rides', label: 'View map' }}>
            <ul className="divide-y divide-burgundy-light/60">
              {LIVE_RIDES.slice(0, 4).map((r) => (
                <li key={r.id} className="py-3 flex items-center gap-3">
                  <StatusPill status={r.status} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-beige truncate">
                      <span className="text-beige-muted">{r.id} · </span>
                      {r.rider.name} → {r.drop.address.split(',')[0]}
                    </div>
                    <div className="text-xs text-beige-muted truncate">
                      Driver {r.driver.name} · ★{r.driver.rating.toFixed(1)} · {r.driver.vehicle}
                    </div>
                  </div>
                  <div className="text-sm tabular-nums text-beige">₹{r.fareInr}</div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Incidents" link={{ href: '/incidents', label: 'Open dashboard' }}>
            {INCIDENTS.length === 0 ? (
              <div className="py-6 text-sm text-beige-muted">No open incidents.</div>
            ) : (
              <ul className="divide-y divide-burgundy-light/60">
                {INCIDENTS.map((i) => (
                  <li key={i.id} className="py-3 flex items-start gap-3">
                    <SeverityBadge severity={i.severity} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-beige">
                        <span className="text-beige-muted">{i.id} · </span>
                        {humanType(i.type)}
                      </div>
                      <div className="text-xs text-beige-muted">
                        Ride {i.rideId} · {i.rider} ↔ {i.driver} · {i.raisedMinAgo} min ago
                      </div>
                    </div>
                    <div className="text-xs uppercase tracking-wider text-beige-muted">
                      {i.status}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Onboarding queue" link={{ href: '/onboarding', label: 'Review applications' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-beige-muted text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-2 pr-4">Applicant</th>
                  <th className="py-2 pr-4">Vehicle</th>
                  <th className="py-2 pr-4">Docs</th>
                  <th className="py-2 pr-4">Training</th>
                  <th className="py-2 pr-4">Submitted</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-burgundy-light/60">
                {ONBOARDING_QUEUE.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3 pr-4">
                      <div className="text-beige">{a.name}</div>
                      <div className="text-xs text-beige-muted">{a.id} · {a.city}</div>
                    </td>
                    <td className="py-3 pr-4 capitalize text-beige">{a.vehicle}</td>
                    <td className="py-3 pr-4 tabular-nums">
                      <span className={a.docsComplete === a.docsTotal ? 'text-success' : 'text-gold'}>
                        {a.docsComplete}/{a.docsTotal}
                      </span>
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {a.trainingScore == null ? (
                        <span className="text-beige-muted">pending</span>
                      ) : (
                        <span className={a.trainingScore >= 80 ? 'text-success' : 'text-gold'}>
                          {a.trainingScore}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-beige-muted">
                      {a.submittedDaysAgo === 1 ? '1 day ago' : `${a.submittedDaysAgo} days ago`}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/onboarding"
                        className="text-gold hover:text-beige text-xs uppercase tracking-wider"
                      >
                        Review →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}

function Kpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: 'gold' | 'success' | 'danger';
}) {
  const border =
    accent === 'success'
      ? 'border-success/40'
      : accent === 'danger'
        ? 'border-danger/60'
        : accent === 'gold'
          ? 'border-gold/40'
          : 'border-burgundy-light/60';
  return (
    <div className={`rounded-lg border ${border} bg-burgundy/70 px-4 py-3`}>
      <div className="text-[11px] uppercase tracking-wider text-beige-muted">{label}</div>
      <div className="mt-1 text-2xl font-serif text-beige tabular-nums">{value}</div>
    </div>
  );
}

function Panel({
  title,
  link,
  children,
}: {
  title: string;
  link?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-burgundy-light/60 bg-burgundy/60">
      <div className="flex items-center justify-between px-5 py-3 border-b border-burgundy-light/60">
        <h2 className="font-serif text-lg text-beige">{title}</h2>
        {link ? (
          <Link
            href={link.href}
            className="text-xs uppercase tracking-wider text-gold hover:text-beige"
          >
            {link.label} →
          </Link>
        ) : null}
      </div>
      <div className="px-5 pb-1">{children}</div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    requested: { color: 'bg-gold/20 text-gold border-gold/40', label: 'Requested' },
    driver_en_route: { color: 'bg-burgundy-light text-beige border-beige/30', label: 'En route' },
    on_trip: { color: 'bg-success/20 text-success border-success/40', label: 'On trip' },
    completing: { color: 'bg-burgundy-light text-beige-muted border-burgundy-light', label: 'Completing' },
  };
  const m = map[status] ?? map.requested;
  return (
    <span className={`shrink-0 text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 ${m.color}`}>
      {m.label}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: 'bg-danger/20 text-danger border-danger/50',
    high: 'bg-gold/20 text-gold border-gold/40',
    medium: 'bg-burgundy-light text-beige-muted border-burgundy-light',
  };
  return (
    <span
      className={`shrink-0 text-[10px] uppercase tracking-wider border rounded px-2 py-0.5 ${
        map[severity] ?? map.medium
      }`}
    >
      {severity}
    </span>
  );
}

function humanType(t: string) {
  switch (t) {
    case 'sos':
      return 'SOS triggered';
    case 'route_deviation':
      return 'Route deviation';
    case 'late_pickup':
      return 'Late pickup';
    case 'cash_dispute':
      return 'Cash dispute';
    default:
      return t;
  }
}
