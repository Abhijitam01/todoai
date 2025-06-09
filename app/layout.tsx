import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

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
  openGraph: {
    title: 'TodoAI - Turn Your Goals Into Daily Action',
    description: 'Transform your ambitions into personalized day-by-day plans with the power of AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body 
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable
        )}
      >
        {children}
      </body>
    </html>
  )
} 