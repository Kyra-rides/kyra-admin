'use client';

/**
 * Vertical step-by-step status timeline for the live ride.
 * Active step animates with a pulsing dot. Completed steps show a check.
 */

import type { RideDoc } from '@/lib/ride-firestore';

type Step = {
  key: string;
  label: string;
  detail: string;
  state: 'done' | 'active' | 'pending';
};

function fmtTime(d: Date | null | undefined) {
  if (!d) return '—';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function RideTimeline({ ride, otp }: { ride: RideDoc | null; otp: string | null }) {
  const steps = stepsFor(ride, otp);

  return (
    <div className="rounded-lg border border-burgundy-light/60 bg-burgundy/60 p-4">
      <div className="text-[11px] uppercase tracking-[0.18em] text-beige-muted mb-3">
        Ride timeline
      </div>
      <ol className="space-y-2.5 relative">
        {steps.map((s, idx) => (
          <li key={s.key} className="flex gap-3 items-start">
            <div className="flex flex-col items-center shrink-0">
              <span
                className={
                  'w-3 h-3 rounded-full border-2 ' +
                  (s.state === 'done'
                    ? 'bg-success border-success'
                    : s.state === 'active'
                      ? 'bg-gold border-gold animate-pulse'
                      : 'bg-transparent border-burgundy-light')
                }
              />
              {idx < steps.length - 1 ? (
                <span
                  className={
                    'w-px flex-1 mt-0.5 ' +
                    (s.state === 'done' ? 'bg-success/50' : 'bg-burgundy-light')
                  }
                  style={{ minHeight: 18 }}
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={
                    'text-sm ' +
                    (s.state === 'pending' ? 'text-beige-muted' : 'text-beige')
                  }
                >
                  {s.label}
                </span>
                <span className="text-[11px] text-beige-muted tabular-nums">{s.detail.split(' · ')[0]}</span>
              </div>
              {s.detail.includes(' · ') ? (
                <div className="text-xs text-beige-muted mt-0.5 truncate">
                  {s.detail.split(' · ').slice(1).join(' · ')}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function stepsFor(ride: RideDoc | null, otp: string | null): Step[] {
  if (!ride) {
    return [
      { key: 'booked', label: 'Booking', detail: '— · awaiting rider', state: 'pending' },
      { key: 'dispatched', label: 'Dispatch', detail: '— · ', state: 'pending' },
      { key: 'accepted', label: 'Accepted', detail: '— · ', state: 'pending' },
      { key: 'started', label: 'Started', detail: '— · ', state: 'pending' },
      { key: 'completed', label: 'Completed', detail: '— · ', state: 'pending' },
    ];
  }

  const created = ride.createdAt?.toDate ? ride.createdAt.toDate() : null;
  const accepted = ride.acceptedAt?.toDate ? ride.acceptedAt.toDate() : null;
  const started = ride.startedAt?.toDate ? ride.startedAt.toDate() : null;
  const completed = ride.completedAt?.toDate ? ride.completedAt.toDate() : null;

  const stepStates = (s: RideDoc['status']): Record<string, 'done' | 'active' | 'pending'> => {
    if (s === 'requested')
      return { booked: 'done', dispatched: 'active', accepted: 'pending', started: 'pending', completed: 'pending' };
    if (s === 'dispatching')
      return { booked: 'done', dispatched: 'active', accepted: 'pending', started: 'pending', completed: 'pending' };
    if (s === 'accepted')
      return { booked: 'done', dispatched: 'done', accepted: 'active', started: 'pending', completed: 'pending' };
    if (s === 'in_progress')
      return { booked: 'done', dispatched: 'done', accepted: 'done', started: 'active', completed: 'pending' };
    if (s === 'completed')
      return { booked: 'done', dispatched: 'done', accepted: 'done', started: 'done', completed: 'active' };
    return { booked: 'done', dispatched: 'done', accepted: 'done', started: 'done', completed: 'done' };
  };
  const states = stepStates(ride.status);

  return [
    {
      key: 'booked',
      label: 'Booked',
      detail: `${fmtTime(created)} · ${ride.rider.name}`,
      state: states.booked,
    },
    {
      key: 'dispatched',
      label: 'Dispatched',
      detail: `${fmtTime(created)} · → ${ride.driver?.name ?? '…'}`,
      state: states.dispatched,
    },
    {
      key: 'accepted',
      label: 'Accepted' + (otp ? ` · OTP ${otp}` : ''),
      detail: `${fmtTime(accepted)} · ${ride.driver?.vehicle ?? '—'}`,
      state: states.accepted,
    },
    {
      key: 'started',
      label: 'Ride started',
      detail: `${fmtTime(started)} · OTP verified`,
      state: states.started,
    },
    {
      key: 'completed',
      label: 'Completed',
      detail: `${fmtTime(completed)} · ₹${ride.fareInr}`,
      state: states.completed,
    },
  ];
}
