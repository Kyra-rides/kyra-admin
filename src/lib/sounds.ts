/**
 * Web-Audio chimes for the live dispatch console.
 *
 * No external audio files — synthesized sine envelopes so we keep the bundle
 * tiny and don't fight licensing. Each tone is a short ASR envelope (attack
 * 20ms / sustain ~100ms / release 200ms) so it sounds like a soft notification
 * bell rather than a beep.
 *
 * Browsers gate audio behind a user gesture. If the page hasn't received a
 * click yet, AudioContext.createOscillator() will throw or stay suspended —
 * we just swallow the error so the demo never visibly stutters.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  try {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    return ctx;
  } catch {
    return null;
  }
}

function tone(opts: { freq: number; start: number; duration: number; gain?: number }) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + opts.start;
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = opts.freq;
  env.gain.setValueAtTime(0, t0);
  env.gain.linearRampToValueAtTime(opts.gain ?? 0.12, t0 + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.duration);
  osc.connect(env);
  env.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + opts.duration + 0.05);
}

/** Two-note rising chime — used when a fresh ride request lands. */
export function playNewRideChime() {
  try {
    tone({ freq: 880, start: 0, duration: 0.35 });
    tone({ freq: 1320, start: 0.09, duration: 0.45 });
  } catch {
    /* user gesture not received yet — silent no-op */
  }
}

/** Single high tone — used when the driver accepts the ride. */
export function playAcceptChime() {
  try {
    tone({ freq: 1100, start: 0, duration: 0.28, gain: 0.1 });
  } catch {
    /* no-op */
  }
}

/** Soft confirmation tone — used when the ride completes (driver ended). */
export function playCompleteChime() {
  try {
    tone({ freq: 660, start: 0, duration: 0.32, gain: 0.09 });
    tone({ freq: 880, start: 0.12, duration: 0.36, gain: 0.09 });
  } catch {
    /* no-op */
  }
}
