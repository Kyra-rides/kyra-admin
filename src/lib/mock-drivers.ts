/**
 * Decorative "online driver" pins for the live dispatch map.
 *
 * For the prototype demo, exactly one driver (Priya, in ride-firestore.ts)
 * is real. These are visual decoration only — they make Bengaluru look alive
 * without participating in the dispatch flow. ~10 women drivers spread across
 * key Kyra zones (Indiranagar, HSR, Koramangala, Whitefield, Jayanagar, BTM,
 * Electronic City, Marathahalli, Hebbal, Yeshwanthpur).
 */

export type FleetPin = {
  id: string;
  name: string;
  vehicle: 'auto' | 'bike';
  coords: { lat: number; lng: number };
};

export const MOCK_FLEET: FleetPin[] = [
  { id: 'd-002', name: 'Lakshmi R.',     vehicle: 'auto', coords: { lat: 12.9296, lng: 77.5829 } },
  { id: 'd-003', name: 'Saraswathi M.',  vehicle: 'bike', coords: { lat: 12.9116, lng: 77.6477 } },
  { id: 'd-004', name: 'Geetha S.',      vehicle: 'auto', coords: { lat: 12.9698, lng: 77.7499 } },
  { id: 'd-005', name: 'Anitha P.',      vehicle: 'auto', coords: { lat: 12.9167, lng: 77.6101 } },
  { id: 'd-006', name: 'Padma L.',       vehicle: 'bike', coords: { lat: 12.8413, lng: 77.6620 } },
  { id: 'd-007', name: 'Indira K.',      vehicle: 'auto', coords: { lat: 12.9591, lng: 77.7011 } },
  { id: 'd-008', name: 'Rekha S.',       vehicle: 'auto', coords: { lat: 13.0358, lng: 77.5970 } },
  { id: 'd-009', name: 'Bhavana T.',     vehicle: 'bike', coords: { lat: 13.0287, lng: 77.5402 } },
  { id: 'd-010', name: 'Kavya J.',       vehicle: 'auto', coords: { lat: 12.9342, lng: 77.6131 } },
  { id: 'd-011', name: 'Pooja R.',       vehicle: 'bike', coords: { lat: 12.9870, lng: 77.5440 } },
];
