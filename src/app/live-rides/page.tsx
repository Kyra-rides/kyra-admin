'use client';

import { useEffect, useRef, useState } from 'react';

import { AgentLog } from '@/components/agent-log';
import { FleetMap } from '@/components/fleet-map';
import { PageHeader } from '@/components/page-header';
import { RideDetailsCard } from '@/components/ride-details-card';
import { RideTimeline } from '@/components/ride-timeline';
import { useRideOrchestrator } from '@/lib/use-ride-orchestrator';
import {
  subscribeLatestRide,
  subscribeRideSecret,
  type RideDoc,
} from '@/lib/ride-firestore';
import {
  playAcceptChime,
  playCompleteChime,
  playNewRideChime,
} from '@/lib/sounds';

export default function LiveRidesPage() {
  const [ride, setRide] = useState<RideDoc | null>(null);
  const [otp, setOtp] = useState<string | null>(null);

  useEffect(() => subscribeLatestRide(setRide), []);

  // Watch the OTP secret subcollection (admin can read it; driver clients don't).
  useEffect(() => {
    if (!ride) {
      setOtp(null);
      return;
    }
    if (
      ride.status === 'requested' ||
      ride.status === 'dispatching' ||
      ride.status === 'cancelled'
    ) {
      setOtp(null);
      return;
    }
    return subscribeRideSecret(ride.id, setOtp);
  }, [ride?.id, ride?.status]);

  // Drive the dispatch automation: agent theater → OTP gen → OTP verify.
  useRideOrchestrator(ride, otp);

  // Subtle audio cues at the demo's three peak moments. Browsers gate audio
  // behind a user gesture; sounds.ts swallows the failure if the page hasn't
  // received a click yet, so this never crashes the demo.
  const lastSeenStateRef = useRef<{ id: string | null; status: string | null }>({ id: null, status: null });
  useEffect(() => {
    const prev = lastSeenStateRef.current;
    const now = { id: ride?.id ?? null, status: ride?.status ?? null };
    // New ride request just landed.
    if (now.id && now.id !== prev.id && now.status === 'requested') {
      playNewRideChime();
    }
    // Same ride transitioned: dispatching → accepted.
    if (now.id && now.id === prev.id && prev.status === 'dispatching' && now.status === 'accepted') {
      playAcceptChime();
    }
    // Same ride transitioned: in_progress → completed.
    if (now.id && now.id === prev.id && prev.status === 'in_progress' && now.status === 'completed') {
      playCompleteChime();
    }
    lastSeenStateRef.current = now;
  }, [ride?.id, ride?.status]);

  const isActive =
    ride != null &&
    ride.status !== 'rated' &&
    ride.status !== 'cancelled';

  return (
    <>
      <PageHeader
        title="Live dispatch"
        subtitle={
          isActive
            ? `1 active ride · agent connecting rider to nearest driver`
            : `Standing by — waiting for the next rider request from the Kyra app.`
        }
        right={
          <div className="flex items-center gap-2 text-xs text-beige-muted">
            <span
              className={
                'inline-block w-2 h-2 rounded-full ' +
                (isActive ? 'bg-success animate-pulse' : 'bg-beige-muted/60')
              }
            />
            {isActive ? 'Live · streaming from Firestore' : 'Idle'}
          </div>
        }
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_26rem] gap-4 p-4 min-h-0">
        <div className="min-h-[480px] lg:min-h-0">
          <FleetMap ride={ride} />
        </div>

        <aside className="flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
          <AgentLog ride={ride} otp={otp} />
          <RideTimeline ride={ride} otp={otp} />
          <RideDetailsCard ride={ride} otp={otp} />
        </aside>
      </div>
    </>
  );
}
