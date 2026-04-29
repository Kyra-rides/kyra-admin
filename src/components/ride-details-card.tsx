'use client';

/**
 * Compact ride details card — shows everything an ops agent needs at a glance.
 * Mirrors the data the user said the admin should see: who/where/when/fare.
 */

import type { RideDoc } from '@/lib/ride-firestore';

const STATUS_LABEL: Record<RideDoc['status'], string> = {
  requested: 'Booked · awaiting agent',
  dispatching: 'Connecting to driver',
  accepted: 'Driver heading to pickup',
  in_progress: 'On trip',
  completed: 'Awaiting rating',
  rated: 'Closed',
  cancelled: 'Cancelled',
};

const STATUS_COLOR: Record<RideDoc['status'], string> = {
  requested: 'bg-gold/20 text-gold border-gold/50',
  dispatching: 'bg-gold/20 text-gold border-gold/50',
  accepted: 'bg-burgundy-light text-beige border-beige/40',
  in_progress: 'bg-success/20 text-success border-success/50',
  completed: 'bg-burgundy-light text-beige-muted border-burgundy-light',
  rated: 'bg-burgundy-light text-beige-muted border-burgundy-light',
  cancelled: 'bg-danger/20 text-danger border-danger/40',
};

export function RideDetailsCard({ ride, otp }: { ride: RideDoc | null; otp: string | null }) {
  if (!ride) {
    return (
      <div className="rounded-lg border border-burgundy-light/60 bg-burgundy/60 p-5 space-y-2">
        <div className="text-sm text-beige-muted">No active ride.</div>
        <div className="text-xs text-beige-muted">
          When a rider books from the Kyra app, this panel will populate live.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-burgundy-light/60 bg-burgundy-dark/60 p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.18em] text-beige-muted">Active ride</div>
          <h3 className="font-serif text-lg text-beige truncate">{ride.id}</h3>
        </div>
        <span className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 whitespace-nowrap ${STATUS_COLOR[ride.status]}`}>
          {STATUS_LABEL[ride.status]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm pt-1">
        <Field label="Rider" value={ride.rider.name} sub={ride.rider.phone} />
        <Field label="Driver" value={ride.driver?.name ?? '—'} sub={ride.driver?.vehicle ?? 'Unassigned'} />
      </div>

      <div className="space-y-2 pt-2 border-t border-burgundy-light/60">
        <div className="flex gap-2 items-start">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-success shrink-0" />
          <div className="min-w-0">
            <div className="text-beige-muted text-[11px] uppercase tracking-wider">Pickup</div>
            <div className="text-beige text-sm">{ride.pickup.address || ride.pickup.name}</div>
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />
          <div className="min-w-0">
            <div className="text-beige-muted text-[11px] uppercase tracking-wider">Drop</div>
            <div className="text-beige text-sm">{ride.drop.address || ride.drop.name}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-burgundy-light/60">
        <Field label="Distance" value={`${ride.distanceKm.toFixed(1)} km`} sub="route" />
        <Field label="Fare" value={`₹${ride.fareInr}`} sub={ride.vehicleType === 'auto' ? 'Auto' : 'Bike'} />
        <Field label="ETA" value={ride.durationMin > 0 ? `${ride.durationMin} min` : '—'} sub="driving" />
      </div>

      {otp && (ride.status === 'accepted' || ride.status === 'dispatching') ? (
        <div className="rounded-md border border-gold/50 bg-burgundy/70 p-3 mt-2">
          <div className="text-[10px] uppercase tracking-[0.18em] text-beige-muted">Issued OTP · rider only</div>
          <div className="font-mono text-2xl text-gold tracking-[0.4em] mt-1">{otp}</div>
          <div className="text-[11px] text-beige-muted mt-1">
            Driver doesn't see this. Rider tells driver verbally at pickup.
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wider text-beige-muted">{label}</div>
      <div className="text-beige truncate">{value}</div>
      <div className="text-xs text-beige-muted truncate">{sub}</div>
    </div>
  );
}
