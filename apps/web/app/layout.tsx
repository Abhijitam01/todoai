import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { ToastProvider } from '@/components/ui/toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'TodoAI - Turn Your Goals Into Daily Action',
  description: 'Transform your ambitions into personalized day-by-day plans with the power of AI. TodoAI makes goal achievement simple and consistent.',
  keywords: ['AI', 'productivity', 'goal planning', 'todo', 'task management'],
  authors: [{ name: 'TodoAI Team' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.svg', sizes: '32x32', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'TodoAI - Turn Your Goals Into Daily Action',
    description: 'Transform your ambitions into personalized day-by-day plans with the power of AI.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#ef4444',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon-32x32.svg" sizes="32x32" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
      </head>
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        <ToastProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </ToastProvider>
      </body>
    </html>
  )
} 