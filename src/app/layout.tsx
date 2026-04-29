import type { Metadata } from 'next';
import { Inter, Libre_Baskerville } from 'next/font/google';

import { Sidebar } from '@/components/sidebar';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const baskerville = Libre_Baskerville({
  variable: '--font-baskerville',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Kyra Admin · Ops portal',
  description:
    'Internal operations console for Kyra — driver onboarding, live ride monitoring, incident response.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${baskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-burgundy-dark text-beige">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
