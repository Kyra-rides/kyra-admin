export type Coords = { lat: number; lng: number };

export type LiveRide = {
  id: string;
  rider: { name: string; phone: string };
  driver: { name: string; vehicle: string; rating: number };
  pickup: { address: string; coords: Coords };
  drop: { address: string; coords: Coords };
  fareInr: number;
  status: 'requested' | 'driver_en_route' | 'on_trip' | 'completing';
  startedAtMinAgo: number;
};

export type OnboardingApplication = {
  id: string;
  name: string;
  city: string;
  vehicle: 'auto' | 'bike';
  submittedDaysAgo: number;
  docsComplete: number;
  docsTotal: number;
  trainingScore: number | null;
};

export type Incident = {
  id: string;
  rideId: string;
  type: 'sos' | 'route_deviation' | 'late_pickup' | 'cash_dispute';
  severity: 'critical' | 'high' | 'medium';
  rider: string;
  driver: string;
  raisedMinAgo: number;
  status: 'open' | 'triaged' | 'resolved';
};

export const LIVE_RIDES: LiveRide[] = [
  {
    id: 'KR-9132',
    rider: { name: 'Aanya Sharma', phone: '+91 98••• 4421' },
    driver: { name: 'Priya Devi', vehicle: 'KA-01-XX-2104 · Auto', rating: 4.9 },
    pickup: {
      address: 'Indiranagar Metro Station, 100 Feet Road',
      coords: { lat: 12.9784, lng: 77.6408 },
    },
    drop: {
      address: 'Manyata Tech Park, Outer Ring Road',
      coords: { lat: 13.0418, lng: 77.6217 },
    },
    fareInr: 248,
    status: 'on_trip',
    startedAtMinAgo: 6,
  },
  {
    id: 'KR-9134',
    rider: { name: 'Meera Iyer', phone: '+91 99••• 7782' },
    driver: { name: 'Lakshmi R.', vehicle: 'KA-05-AB-7831 · Auto', rating: 4.8 },
    pickup: {
      address: 'Jayanagar 4th Block, BDA Complex',
      coords: { lat: 12.9296, lng: 77.5829 },
    },
    drop: {
      address: 'Kempegowda Intl Airport, Terminal 1',
      coords: { lat: 13.1986, lng: 77.7066 },
    },
    fareInr: 612,
    status: 'driver_en_route',
    startedAtMinAgo: 2,
  },
  {
    id: 'KR-9136',
    rider: { name: 'Riya Kapoor', phone: '+91 91••• 0188' },
    driver: { name: 'Saraswathi M.', vehicle: 'KA-03-MJ-4421 · Bike', rating: 4.7 },
    pickup: {
      address: 'HSR Layout Sector 2, 27th Main',
      coords: { lat: 12.9116, lng: 77.6477 },
    },
    drop: {
      address: 'Koramangala 5th Block, Forum Mall',
      coords: { lat: 12.9342, lng: 77.6131 },
    },
    fareInr: 96,
    status: 'requested',
    startedAtMinAgo: 0,
  },
  {
    id: 'KR-9138',
    rider: { name: 'Sneha Nair', phone: '+91 90••• 3320' },
    driver: { name: 'Geetha S.', vehicle: 'KA-02-CD-9912 · Auto', rating: 4.95 },
    pickup: {
      address: 'Whitefield, ITPL Main Road',
      coords: { lat: 12.9698, lng: 77.7499 },
    },
    drop: {
      address: 'MG Road Metro, Trinity Circle',
      coords: { lat: 12.9756, lng: 77.6068 },
    },
    fareInr: 384,
    status: 'completing',
    startedAtMinAgo: 28,
  },
  {
    id: 'KR-9141',
    rider: { name: 'Divya M.', phone: '+91 87••• 1101' },
    driver: { name: 'Anitha P.', vehicle: 'KA-09-XY-3340 · Auto', rating: 4.85 },
    pickup: {
      address: 'BTM Layout 2nd Stage, 16th Main',
      coords: { lat: 12.9167, lng: 77.6101 },
    },
    drop: {
      address: 'Electronic City Phase 1, Infosys Gate 4',
      coords: { lat: 12.8413, lng: 77.6620 },
    },
    fareInr: 268,
    status: 'on_trip',
    startedAtMinAgo: 12,
  },
];

export const ONBOARDING_QUEUE: OnboardingApplication[] = [
  { id: 'KAN-2041', name: 'Asha Kumari', city: 'Bengaluru', vehicle: 'auto', submittedDaysAgo: 1, docsComplete: 6, docsTotal: 6, trainingScore: 92 },
  { id: 'KAN-2042', name: 'Ramya Krishnan', city: 'Bengaluru', vehicle: 'bike', submittedDaysAgo: 2, docsComplete: 6, docsTotal: 6, trainingScore: 88 },
  { id: 'KAN-2043', name: 'Bhavya N.', city: 'Bengaluru', vehicle: 'auto', submittedDaysAgo: 3, docsComplete: 5, docsTotal: 6, trainingScore: null },
  { id: 'KAN-2044', name: 'Sushma D.', city: 'Bengaluru', vehicle: 'auto', submittedDaysAgo: 4, docsComplete: 6, docsTotal: 6, trainingScore: 71 },
];

export const INCIDENTS: Incident[] = [
  { id: 'INC-118', rideId: 'KR-9092', type: 'sos', severity: 'critical', rider: 'Pooja R.', driver: 'Rekha S.', raisedMinAgo: 4, status: 'open' },
  { id: 'INC-117', rideId: 'KR-9087', type: 'route_deviation', severity: 'high', rider: 'Tara V.', driver: 'Padma L.', raisedMinAgo: 22, status: 'triaged' },
  { id: 'INC-116', rideId: 'KR-9081', type: 'late_pickup', severity: 'medium', rider: 'Kavya J.', driver: 'Indira K.', raisedMinAgo: 41, status: 'triaged' },
];

export const KPIS = {
  onlineDrivers: 84,
  ridesInProgress: 23,
  completedToday: 412,
  revenueTodayInr: 87420,
  openIncidents: 2,
  pendingApprovals: ONBOARDING_QUEUE.length,
};
