'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV: Array<{ href: string; label: string; icon: string }> = [
  { href: '/', label: 'Dashboard', icon: 'M3 11l9-8 9 8M5 9.5V21h14V9.5' },
  { href: '/live-rides', label: 'Live rides', icon: 'M12 2C7 2 5 6 5 10c0 5 7 12 7 12s7-7 7-12c0-4-2-8-7-8zm0 10a3 3 0 110-6 3 3 0 010 6z' },
  { href: '/onboarding', label: 'Onboarding queue', icon: 'M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5z' },
  { href: '/drivers', label: 'Drivers', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 1114 0' },
  { href: '/incidents', label: 'Incidents', icon: 'M12 9v4m0 4h.01M10.29 3.86l-8.45 14.6A2 2 0 003.59 22h16.82a2 2 0 001.75-3.54l-8.45-14.6a2 2 0 00-3.42 0z' },
  { href: '/pricing', label: 'Pricing & zones', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6' },
  { href: '/reports', label: 'Reports', icon: 'M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-9 4h12a2 2 0 002-2V7l-5-5H6a2 2 0 00-2 2v14a2 2 0 002 2z' },
];

// Initial values render identically on server and client (no hydration risk).
// Once mounted, we tick the "paid out" counter every 8s by a small random
// amount so the dashboard feels alive even when no demo ride is in flight.
const INITIAL_PAID_INR = 421840;
const INITIAL_WOMEN_EARNING = 247;

export function Sidebar() {
  const pathname = usePathname();
  const [paid, setPaid] = useState(INITIAL_PAID_INR);
  const [women, setWomen] = useState(INITIAL_WOMEN_EARNING);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const paidT = setInterval(() => {
      setPaid((p) => p + Math.floor(80 + Math.random() * 220));
    }, 8000);
    const womenT = setInterval(() => {
      setWomen((w) => w + (Math.random() < 0.3 ? 1 : 0));
    }, 30000);
    return () => {
      clearInterval(paidT);
      clearInterval(womenT);
    };
  }, []);

  return (
    <aside className="w-60 shrink-0 border-r border-burgundy-light/60 bg-burgundy-dark/60 flex flex-col">
      <div className="px-5 pt-6 pb-5 border-b border-burgundy-light/60">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-xl text-beige tracking-wide">KYRA</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold">Admin</span>
        </div>
        <div className="mt-1 text-[11px] text-beige-muted">Bengaluru ops</div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 text-sm">
        {NAV.map((item) => {
          const active =
            item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors ' +
                (active
                  ? 'bg-burgundy-light text-beige border border-gold/40'
                  : 'text-beige-muted hover:bg-burgundy-light/40 hover:text-beige border border-transparent')
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-burgundy-light/60 space-y-2.5">
        <div className="text-[10px] uppercase tracking-[0.2em] text-beige-muted">
          Today across Kyra
        </div>
        <Stat label="Women earning" value={women.toLocaleString('en-IN')} accent="success" />
        <Stat
          label="Paid to drivers"
          value={`₹${paid.toLocaleString('en-IN')}`}
          live={mounted}
        />
        <Stat label="Open SOS" value="0" accent="success" />
      </div>

      <div className="px-4 py-3 border-t border-burgundy-light/60 text-[11px] text-beige-muted">
        <div>Signed in as</div>
        <div className="text-beige">Shivansh · Ops admin</div>
      </div>
    </aside>
  );
}

function Stat({
  label,
  value,
  accent,
  live,
}: {
  label: string;
  value: string;
  accent?: 'success' | 'gold';
  live?: boolean;
}) {
  const valueColor =
    accent === 'success' ? 'text-success' : accent === 'gold' ? 'text-gold' : 'text-beige';
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[11px] text-beige-muted truncate">{label}</span>
      <span className={`text-sm tabular-nums ${valueColor} flex items-center gap-1.5`}>
        {value}
        {live ? (
          <span className="w-1 h-1 rounded-full bg-success animate-pulse" aria-hidden />
        ) : null}
      </span>
    </div>
  );
}
