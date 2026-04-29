'use client';

import { useEffect, useRef, useState } from 'react';

import { GOOGLE_MAPS_KEY } from '@/lib/maps';
import { MOCK_FLEET } from '@/lib/mock-drivers';
import type { RideDoc } from '@/lib/ride-firestore';

/**
 * Side-view auto-rickshaw silhouette in Kyra colours.
 *
 * Real Bengaluru autos are green (body) + yellow (canopy). The Kyra livery
 * inverts that scheme: maroon body (Brand.burgundy) + beige canopy
 * (Brand.beige). Used as the marker icon for every online driver pin so the
 * fleet looks unmistakably "Kyra" from a glance.
 *
 *   `active`  drivers get a gold border + thicker stroke to stand out from
 *             the muted decorative fleet.
 */
function autoSvg(active: boolean): string {
  // Halo behind the rickshaw — lifts the icon off the dark map.
  // Active pin gets a brighter, gold-tinted halo + thicker stroke.
  const haloFill = active ? '#CEB37E' : '#E8DAC9';
  const haloOpacity = active ? '0.92' : '0.78';
  const stroke = active ? '#CEB37E' : '#846847';
  const strokeW = active ? '1.0' : '0.7';
  const beam = active ? '#CEB37E' : '#846847';
  // Larger viewBox so the halo sits behind the rickshaw without clipping.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 40 32"><rect x="-2" y="-2" width="36" height="28" rx="6" fill="${haloFill}" opacity="${haloOpacity}"/><path d="M5 11 L5 5 Q5 3 8 3 L24 3 Q27 3 27 5 L27 11 Z" fill="#E8DAC9" stroke="#21080C" stroke-width="0.5" stroke-linejoin="round"/><rect x="7" y="5" width="18" height="6" fill="#21080C" opacity="0.55"/><rect x="14" y="3" width="1.4" height="8" fill="${beam}"/><path d="M3 18 L3 11 L29 11 L29 18 Q29 20 27 20 L5 20 Q3 20 3 18 Z" fill="#2F0E13" stroke="#21080C" stroke-width="0.5" stroke-linejoin="round"/><path d="M3 16 L1.5 14 L3 11 Z" fill="#45171E"/><circle cx="2.2" cy="14.5" r="0.55" fill="#CEB37E"/><circle cx="8" cy="21" r="2.6" fill="#21080C"/><circle cx="24" cy="21" r="2.6" fill="#21080C"/><circle cx="8" cy="21" r="1" fill="#CEB37E"/><circle cx="24" cy="21" r="1" fill="#CEB37E"/><rect x="-3" y="-3" width="38" height="30" rx="7" fill="none" stroke="${stroke}" stroke-width="${strokeW}" opacity="${active ? '1' : '0.55'}"/></svg>`;
}

function autoIcon(g: typeof google.maps, opts: { active?: boolean; size?: number } = {}): google.maps.Icon {
  const { active = false, size = active ? 48 : 30 } = opts;
  // viewBox is now 40×32, so ratio is 32/40 = 0.8.
  const h = Math.round(size * 0.8);
  const url = `data:image/svg+xml;utf8,${encodeURIComponent(autoSvg(active))}`;
  return {
    url,
    scaledSize: new g.Size(size, h),
    anchor: new g.Point(size / 2, h / 2),
  };
}

const SCRIPT_ID = 'google-maps-js';
const BENGALURU_CENTER = { lat: 12.9716, lng: 77.5946 };

declare global {
  interface Window {
    google?: typeof google;
  }
}

function loadMapsScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('maps load failed')), { once: true });
      return;
    }
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.async = true;
    s.defer = true;
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=geometry`;
    s.addEventListener('load', () => resolve());
    s.addEventListener('error', () => reject(new Error('maps load failed')));
    document.head.appendChild(s);
  });
}

/**
 * Live dispatch fleet map.
 *
 *   - Background: Bengaluru, dark theme, ~10 decorative driver pins (mock).
 *   - Active ride overlay: pickup (green) + drop (gold) + driver pin that
 *     animates from a near-pickup offset → pickup (during 'accepted'), then
 *     pickup → drop (during 'in_progress'). The motion is interpolated for
 *     demo polish; real GPS streaming is post-MVP.
 *   - Auto-fits bounds when an active ride is present.
 */
export function FleetMap({ ride }: { ride: RideDoc | null }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const ridePinsRef = useRef<{
    pickup: google.maps.Marker | null;
    drop: google.maps.Marker | null;
    driver: google.maps.Marker | null;
    polyline: google.maps.Polyline | null;
  }>({ pickup: null, drop: null, driver: null, polyline: null });
  const fleetPinsRef = useRef<google.maps.Marker[]>([]);
  const animRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Load + create map once.
  useEffect(() => {
    let cancelled = false;
    loadMapsScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.google?.maps) return;
        mapRef.current = new window.google.maps.Map(containerRef.current, {
          center: BENGALURU_CENTER,
          zoom: 11,
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: '#21080C',
          styles: KYRA_MAP_STYLE,
        });
        // Decorative fleet pins — auto-rickshaw silhouette in Kyra livery.
        const g = window.google!.maps;
        fleetPinsRef.current = MOCK_FLEET.map((d) => {
          const m = new g.Marker({
            position: d.coords,
            map: mapRef.current,
            title: `${d.name} · online`,
            icon: autoIcon(g, { active: false, size: 30 }),
            opacity: 0.88,
            zIndex: 1,
          });
          return m;
        });
        setMapReady(true);
      })
      .catch((e) => setError(String(e?.message ?? e)));
    return () => {
      cancelled = true;
      fleetPinsRef.current.forEach((m) => m.setMap(null));
      fleetPinsRef.current = [];
    };
  }, []);

  // Sync the active ride: pickup, drop, polyline, driver pin.
  useEffect(() => {
    const map = mapRef.current;
    const g = window.google?.maps;
    if (!map || !g || !mapReady) return;

    // Tear down previous ride markers.
    const pins = ridePinsRef.current;
    pins.pickup?.setMap(null);
    pins.drop?.setMap(null);
    pins.driver?.setMap(null);
    pins.polyline?.setMap(null);
    ridePinsRef.current = { pickup: null, drop: null, driver: null, polyline: null };
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }

    if (!ride || ride.status === 'rated' || ride.status === 'cancelled') {
      // No active ride — pan back to city center.
      map.panTo(BENGALURU_CENTER);
      return;
    }

    const pickup = { lat: ride.pickup.coord.lat, lng: ride.pickup.coord.lng };
    const drop = { lat: ride.drop.coord.lat, lng: ride.drop.coord.lng };

    ridePinsRef.current.pickup = new g.Marker({
      position: pickup,
      map,
      title: `Pickup · ${ride.rider.name}`,
      label: { text: 'A', color: '#21080C', fontWeight: '700', fontSize: '11px' },
      icon: {
        path: g.SymbolPath.CIRCLE,
        fillColor: '#5BD2A2',
        fillOpacity: 1,
        strokeColor: '#21080C',
        strokeWeight: 2,
        scale: 11,
      },
      zIndex: 20,
    });

    ridePinsRef.current.drop = new g.Marker({
      position: drop,
      map,
      title: `Drop · ${ride.drop.name}`,
      label: { text: 'B', color: '#21080C', fontWeight: '700', fontSize: '11px' },
      icon: {
        path: g.SymbolPath.CIRCLE,
        fillColor: '#CEB37E',
        fillOpacity: 1,
        strokeColor: '#21080C',
        strokeWeight: 2,
        scale: 11,
      },
      zIndex: 20,
    });

    ridePinsRef.current.polyline = new g.Polyline({
      path: [pickup, drop],
      geodesic: true,
      strokeColor: '#CEB37E',
      strokeOpacity: 0.55,
      strokeWeight: 3,
      map,
    });

    // Driver pin — only for accepted / in_progress.
    if (ride.status === 'accepted' || ride.status === 'in_progress') {
      const startPos =
        ride.status === 'accepted'
          ? { lat: pickup.lat - 0.012, lng: pickup.lng - 0.012 }
          : pickup;
      const endPos = ride.status === 'accepted' ? pickup : drop;
      const durationMs = ride.status === 'accepted' ? 30000 : 60000;

      const driverMarker = new g.Marker({
        position: startPos,
        map,
        title: ride.driver?.name ?? 'Driver',
        icon: autoIcon(g, { active: true, size: 50 }),
        zIndex: 25,
      });
      ridePinsRef.current.driver = driverMarker;

      // Linear interpolation over the ride window. Easy mock for "live tracking".
      const t0 = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - t0) / durationMs);
        const lat = startPos.lat + (endPos.lat - startPos.lat) * t;
        const lng = startPos.lng + (endPos.lng - startPos.lng) * t;
        driverMarker.setPosition({ lat, lng });
        if (t < 1) {
          animRef.current = requestAnimationFrame(tick);
        }
      };
      animRef.current = requestAnimationFrame(tick);
    }

    // Auto-fit to ride bounds.
    const bounds = new g.LatLngBounds();
    bounds.extend(pickup);
    bounds.extend(drop);
    map.fitBounds(bounds, 80);
  }, [ride?.id, ride?.status, mapReady]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-burgundy-light/60">
      <div ref={containerRef} className="absolute inset-0" />
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-danger bg-burgundy-dark/80">
          Map failed to load: {error}
        </div>
      ) : null}

      {/* Top-left legend */}
      <div className="absolute top-3 left-3 rounded-md border border-burgundy-light/60 bg-burgundy-dark/85 backdrop-blur px-3 py-2 text-[11px] text-beige space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success" /> Rider pickup
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold" /> Drop
        </div>
        <div className="flex items-center gap-2">
          <span dangerouslySetInnerHTML={{ __html: autoSvg(true) }} className="inline-block" style={{ width: 24, height: 19 }} /> Active driver
        </div>
        <div className="flex items-center gap-2">
          <span dangerouslySetInnerHTML={{ __html: autoSvg(false) }} className="inline-block opacity-90" style={{ width: 22, height: 17 }} /> {MOCK_FLEET.length} online drivers
        </div>
      </div>
    </div>
  );
}

const KYRA_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#2F0E13' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#C5A886' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#21080C' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#45171E' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#5B2A30' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#846847' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1a050a' }] },
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#3a1e22' }] },
];
