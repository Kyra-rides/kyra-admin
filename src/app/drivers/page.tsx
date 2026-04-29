import { ComingSoon } from '@/components/coming-soon';

export default function DriversPage() {
  return (
    <ComingSoon
      title="Drivers"
      subtitle="The active fleet — all approved Kyra drivers, their status, ratings, and standing."
      bullets={[
        'Searchable driver directory with rating, completion rate, hours online',
        '3-strike framework view (current strikes, history, appeal status)',
        'Deactivate / reinstate flows with required reason and admin signoff',
        'Per-driver earnings, daily-fee balance, and payout history',
      ]}
    />
  );
}
