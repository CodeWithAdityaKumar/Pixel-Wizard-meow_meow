import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HostelHub — campus living, clearer',
  description: 'A bold, student-first hostel management experience.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
