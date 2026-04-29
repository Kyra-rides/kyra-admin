import { ComingSoon } from '@/components/coming-soon';

export default function PricingPage() {
  return (
    <ComingSoon
      title="Pricing & zones"
      subtitle="Per-zone fare configuration and surge override controls for Bengaluru."
      bullets={[
        'Bengaluru zone editor (geofences, base fare, per-km rate, time-of-day multipliers)',
        'Surge override with required reason + auto-expiry timer',
        'Per-vehicle pricing (auto vs bike) with separate floors',
        'Audit log of every pricing change (who, when, why)',
      ]}
    />
  );
}
