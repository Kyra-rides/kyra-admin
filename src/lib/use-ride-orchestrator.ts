'use client';

/**
 * Admin-side ride orchestrator.
 *
 * The admin web app is the trusted intermediary in the prototype dispatch
 * flow. This hook watches the active ride doc and triggers the side-effects
 * the rider/driver apps can't do themselves:
 *
 *   1. status='requested'      → run "Kyra agent" theater (4-step animation)
 *                                 then auto-dispatch to Priya
 *   2. status='accepted'       → generate a 4-digit OTP into the secret
 *                                 subcollection (rider sees it; driver doesn't)
 *   3. driverOtpAttempt set    → compare to secret; on match flip status to
 *                                 'in_progress', on miss reject the attempt
 *
 * Refs guard against re-firing on every Firestore listener tick.
 */

import { useEffect, useRef } from 'react';

import {
  DEMO_DRIVER,
  dispatchRideToDriver,
  generate4DigitOtp,
  rejectDriverOtpAttempt,
  setAgentStep,
  setRideOtp,
  startRide,
  type RideDoc,
} from './ride-firestore';

const STEP_DELAY_MS = {
  reading: 800,
  searching: 1400,
  found: 1500,
  dispatch: 1500,
};

export function useRideOrchestrator(ride: RideDoc | null, otp: string | null) {
  // Guard against re-running theater on the same ride.
  const lastAdvancedFrom = useRef<string | null>(null);
  const otpGeneratedFor = useRef<string | null>(null);
  const lastProcessedAttempt = useRef<string | null>(null);

  // 1. Agent dispatch theater while status='requested'.
  useEffect(() => {
    if (!ride || ride.status !== 'requested') return;
    const sig = `${ride.id}:${ride.agentStep ?? 'null'}`;
    if (lastAdvancedFrom.current === sig) return;
    lastAdvancedFrom.current = sig;

    let timer: ReturnType<typeof setTimeout> | null = null;
    if (ride.agentStep == null) {
      timer = setTimeout(() => setAgentStep(ride.id, 'reading'), STEP_DELAY_MS.reading);
    } else if (ride.agentStep === 'reading') {
      timer = setTimeout(() => setAgentStep(ride.id, 'searching'), STEP_DELAY_MS.searching);
    } else if (ride.agentStep === 'searching') {
      timer = setTimeout(() => setAgentStep(ride.id, 'found'), STEP_DELAY_MS.found);
    } else if (ride.agentStep === 'found') {
      timer = setTimeout(() => dispatchRideToDriver(ride.id, DEMO_DRIVER), STEP_DELAY_MS.dispatch);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [ride?.id, ride?.status, ride?.agentStep]);

  // 2. Generate OTP when ride is accepted and no secret yet.
  useEffect(() => {
    if (!ride || ride.status !== 'accepted') return;
    if (otp != null) return;
    if (otpGeneratedFor.current === ride.id) return;
    otpGeneratedFor.current = ride.id;
    void setRideOtp(ride.id, generate4DigitOtp());
  }, [ride?.id, ride?.status, otp]);

  // 3. Verify driver OTP attempt against the secret.
  useEffect(() => {
    if (!ride || ride.status !== 'accepted') return;
    if (!ride.driverOtpAttempt || !otp) return;
    const sig = `${ride.id}:${ride.driverOtpAttempt}`;
    if (lastProcessedAttempt.current === sig) return;
    lastProcessedAttempt.current = sig;
    if (ride.driverOtpAttempt === otp) {
      void startRide(ride.id);
    } else {
      void rejectDriverOtpAttempt(ride.id);
    }
  }, [ride?.id, ride?.status, ride?.driverOtpAttempt, otp]);
}
