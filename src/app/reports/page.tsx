import { ComingSoon } from '@/components/coming-soon';

export default function ReportsPage() {
  return (
    <ComingSoon
      title="Reports"
      subtitle="Operational reports and the public transparency report Kyra publishes monthly."
      bullets={[
        'Monthly transparency report (completion rate, incident counts, response times)',
        'Driver onboarding funnel (applied → approved → first ride → 30-day retention)',
        'Revenue and demand by zone, time-of-day, day-of-week',
        'Export to CSV / PDF for ops review and partner / regulator submissions',
      ]}
    />
  );
}
