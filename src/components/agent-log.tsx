'use client';

/**
 * Theatrical agent-narration log shown on the live-rides console.
 *
 * Lines are derived from the ride's current state — rendered as a cumulative
 * console log with fade-in animations. The "active" line shows a thinking
 * indicator (pulsing dot) while the orchestrator is between steps.
 *
 * Note: any timestamps based on `new Date()` are gated behind a hydration
 * sentinel (`mounted`). Otherwise SSR's server clock and the client clock
 * disagree by a second and React throws a hydration error.
 */

import { useEffect, useMemo, useState } from 'react';

import type { RideDoc } from '@/lib/ride-firestore';

type LogLine = {
  key: string;
  ts: string;
  text: string;
  active?: boolean;
};

function fmtTime(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

function tsFor(ride: RideDoc, key: string): string {
  const created = ride.createdAt?.toDate ? ride.createdAt.toDate() : new Date();
  if (key === 'booked' || key === 'reading' || key === 'searching' || key === 'found' || key === 'dispatch') {
    return fmtTime(created);
  }
  if (key === 'accepted' || key === 'otp') {
    const t = ride.acceptedAt?.toDate ? ride.acceptedAt.toDate() : new Date();
    return fmtTime(t);
  }
  if (key === 'started') {
    const t = ride.startedAt?.toDate ? ride.startedAt.toDate() : new Date();
    return fmtTime(t);
  }
  if (key === 'completed' || key === 'rated') {
    const t = ride.completedAt?.toDate ? ride.completedAt.toDate() : new Date();
    return fmtTime(t);
  }
  return fmtTime(new Date());
}

export function AgentLog({ ride, otp }: { ride: RideDoc | null; otp: string | null }) {
  // Skip "now"-based timestamps until after hydration — server and client
  // would otherwise pick different second values and collide.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const now = () => (mounted ? fmtTime(new Date()) : '··:··:··');

  const lines: LogLine[] = useMemo(() => {
    if (!ride) {
      return [
        {
          key: 'idle',
          ts: now(),
          text: 'Standing by — waiting for the next rider request.',
          active: true,
        },
      ];
    }

    const out: LogLine[] = [];
    out.push({ key: 'booked', ts: tsFor(ride, 'booked'), text: `New booking · ${ride.rider.name} → ${ride.drop.name}` });

    if (ride.status === 'requested') {
      const step = ride.agentStep ?? null;
      out.push({ key: 'reading', ts: tsFor(ride, 'reading'), text: 'Reading rider request…', active: step == null });
      if (step === 'reading' || step === 'searching' || step === 'found') {
        out.push({ key: 'searching', ts: tsFor(ride, 'searching'), text: `Searching for online drivers near ${ride.pickup.name}…`, active: step === 'reading' });
      }
      if (step === 'searching' || step === 'found') {
        out.push({ key: 'found', ts: tsFor(ride, 'found'), text: `Found nearest driver: Priya Devi · 0.3 km away`, active: step === 'searching' });
      }
      if (step === 'found') {
        out.push({ key: 'dispatch', ts: tsFor(ride, 'dispatch'), text: 'Connecting Priya to Aanya…', active: true });
      }
      return out;
    }

    out.push({ key: 'reading', ts: tsFor(ride, 'reading'), text: 'Read rider request' });
    out.push({ key: 'searching', ts: tsFor(ride, 'searching'), text: `Searched fleet near ${ride.pickup.name}` });
    out.push({ key: 'found', ts: tsFor(ride, 'found'), text: `Selected Priya Devi · 0.3 km away` });
    out.push({ key: 'dispatch', ts: tsFor(ride, 'dispatch'), text: 'Sent ride request to Priya' });

    if (ride.status === 'dispatching') {
      out.push({
        key: 'await-accept',
        ts: now(),
        text: 'Awaiting driver to accept…',
        active: true,
      });
      return out;
    }

    out.push({ key: 'accepted', ts: tsFor(ride, 'accepted'), text: 'Priya accepted the ride' });
    if (otp) {
      out.push({ key: 'otp', ts: tsFor(ride, 'otp'), text: `Issued ride OTP · ${otp} (rider only)` });
    }

    if (ride.status === 'accepted') {
      if (ride.driverOtpError) {
        out.push({
          key: 'otp-error',
          ts: now(),
          text: `Driver entered wrong OTP — rejected, awaiting retry`,
          active: true,
        });
      } else if (ride.driverOtpAttempt) {
        out.push({
          key: 'otp-checking',
          ts: now(),
          text: `Driver submitted OTP · verifying…`,
          active: true,
        });
      } else {
        out.push({
          key: 'await-pickup',
          ts: now(),
          text: 'Driver heading to pickup — awaiting OTP at pickup',
          active: true,
        });
      }
      return out;
    }

    out.push({ key: 'started', ts: tsFor(ride, 'started'), text: 'OTP verified · ride started' });

    if (ride.status === 'in_progress') {
      out.push({
        key: 'in-progress',
        ts: now(),
        text: `On trip · heading to ${ride.drop.name}`,
        active: true,
      });
      return out;
    }

    out.push({ key: 'completed', ts: tsFor(ride, 'completed'), text: `Ride completed · ${ride.distanceKm.toFixed(1)} km · ₹${ride.fareInr}` });

    if (ride.status === 'completed') {
      out.push({
        key: 'await-rating',
        ts: now(),
        text: 'Awaiting rider rating…',
        active: true,
      });
      return out;
    }

    if (ride.riderRating != null) {
      out.push({
        key: 'rated',
        ts: tsFor(ride, 'rated'),
        text: `Rider rated ${ride.riderRating}★${ride.riderNote ? ` · "${ride.riderNote}"` : ''}`,
      });
    }
    out.push({ key: 'closed', ts: now(), text: 'Ride closed · awaiting next booking', active: true });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride, otp, mounted]);

  return (
    <div className="rounded-lg border border-burgundy-light/60 bg-burgundy-dark/80 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-burgundy-light/60 bg-burgundy/50">
        <span className="inline-block w-2 h-2 rounded-full bg-gold animate-pulse" />
        <span className="text-[11px] uppercase tracking-[0.18em] text-beige-muted font-mono">
          Agent narration
        </span>
        <span className="ml-auto text-[10px] text-beige-muted">live</span>
      </div>
      <ol className="font-mono text-[12.5px] leading-relaxed px-4 py-3 space-y-1.5 max-h-72 overflow-y-auto">
        {lines.map((l) => (
          <li
            key={l.key}
            className={
              'flex gap-2 items-start ' +
              (l.active ? 'text-gold' : 'text-beige')
            }
            style={{ animation: 'log-fade-in 0.32s ease-out' }}
          >
            <span className="text-beige-muted shrink-0">{l.ts}</span>
            <span className="text-beige-muted shrink-0">
              {l.active ? '⋯' : '✓'}
            </span>
            <span className="min-w-0 flex-1">
              {l.text}
              {l.active ? <span className="ml-1 inline-block animate-pulse">▌</span> : null}
            </span>
          </li>
        ))}
      </ol>
      <style>{`
        @keyframes log-fade-in {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
