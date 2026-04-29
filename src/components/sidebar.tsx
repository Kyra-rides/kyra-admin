'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV: Array<{ href: string; label: string; icon: string }> = [
  { href: '/', label: 'Dashboard', icon: 'M3 11l9-8 9 8M5 9.5V21h14V9.5' },
  { href: '/live-rides', label: 'Live rides', icon: 'M12 2C7 2 5 6 5 10c0 5 7 12 7 12s7-7 7-12c0-4-2-8-7-8zm0 10a3 3 0 110-6 3 3 0 010 6z' },
  { href: '/onboarding', label: 'Onboarding queue', icon: 'M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5z' },
  { href: '/drivers', label: 'Drivers', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 1114 0' },
  { href: '/incidents', label: 'Incidents', icon: 'M12 9v4m0 4h.01M10.29 3.86l-8.45 14.6A2 2 0 003.59 22h16.82a2 2 0 001.75-3.54l-8.45-14.6a2 2 0 00-3.42 0z' },
  { href: '/pricing', label: 'Pricing & zones', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6' },
  { href: '/reports', label: 'Reports', icon: 'M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-9 4h12a2 2 0 002-2V7l-5-5H6a2 2 0 00-2 2v14a2 2 0 002 2z' },
];

export function Sidebar() {
  const pathname = usePathname();

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

      <div className="px-4 py-4 border-t border-burgundy-light/60 text-[11px] text-beige-muted">
        <div>Signed in as</div>
        <div className="text-beige">Shivansh · Ops admin</div>
      </div>
    </aside>
  );
}
