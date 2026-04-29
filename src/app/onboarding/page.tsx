import { ComingSoon } from '@/components/coming-soon';

export default function OnboardingPage() {
  return (
    <ComingSoon
      title="Onboarding queue"
      subtitle="Review applications from women drivers — verify documents, training scores, and approve or reject."
      bullets={[
        'Application list with filters (vehicle type, city, status, days waiting)',
        'Per-applicant detail view with all 6 docs (DL, Aadhaar, RC, PSV, training cert, selfie)',
        'Approve / reject with required reason notes',
        'Audit trail per applicant (who reviewed, when, outcome)',
      ]}
    />
  );
}
