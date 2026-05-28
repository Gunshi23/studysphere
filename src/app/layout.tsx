import type { Metadata, Viewport } from 'next';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { AuthProvider } from '@/providers/AuthProvider';

export const viewport: Viewport = {
  themeColor: '#030014',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'StudySphere | Collaborative Virtual Study Rooms',
  description: 'Study Together. Stay Consistent. A collaborative virtual study room platform built for focused learning, community productivity, and deep flow states.',
  keywords: ['Study Room', 'Virtual Coworking', 'Pomodoro', 'Study Tracker', 'Productivity', 'Student Tech'],
  authors: [{ name: 'StudySphere Team' }],
  openGraph: {
    title: 'StudySphere | Collaborative Virtual Study Rooms',
    description: 'A collaborative virtual study room platform built for focused learning, community productivity, and deep flow states.',
    type: 'website',
    url: 'https://studysphere.app',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark scroll-smooth">
      <body className="min-h-full flex flex-col bg-studysphere-bg text-slate-100 overflow-x-hidden selection:bg-studysphere-purple/30">
        <SmoothScroll>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
