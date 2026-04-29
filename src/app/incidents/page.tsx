import { ComingSoon } from '@/components/coming-soon';

export default function IncidentsPage() {
  return (
    <ComingSoon
      title="Incidents"
      subtitle="SOS alerts, route deviations, and safety escalations across all live rides."
      bullets={[
        'Real-time SOS feed with rider/driver location and ride context',
        'Escalation routing (safety officer → police liaison → support)',
        'Incident detail with audio/timeline, route deviation playback, contact buttons',
        'Resolution workflow with required documentation per incident type',
      ]}
    />
  );
}
