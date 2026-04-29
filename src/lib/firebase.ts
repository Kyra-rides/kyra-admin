/**
 * Firebase singleton for the admin web app.
 *
 * For the hackathon MVP, the admin (running on the same laptop as the
 * Firestore emulator) connects via localhost:8080. No cloud project needed.
 *
 * IMPORTANT: only import this module from 'use client' components — Firebase
 * web SDK touches browser APIs at module load and isn't safe in server components.
 */

import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

if (!config.apiKey || !config.projectId) {
  throw new Error(
    'Firebase config missing — copy .env.example to .env.local and fill NEXT_PUBLIC_FIREBASE_* keys.',
  );
}

export const app: FirebaseApp = getApps()[0] ?? initializeApp(config);
export const db: Firestore = getFirestore(app);

const useEmulator = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR !== 'false';
const emulatorHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST ?? '127.0.0.1';
const emulatorPort = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT ?? '8080');

if (useEmulator && typeof window !== 'undefined') {
  const flag = '__kyra_firestore_emu_connected__';
  const g = globalThis as Record<string, unknown>;
  if (!g[flag]) {
    connectFirestoreEmulator(db, emulatorHost, emulatorPort);
    g[flag] = true;
    console.log(`[firebase] Firestore emulator → ${emulatorHost}:${emulatorPort}`);
  }
}
