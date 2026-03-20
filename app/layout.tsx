import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '🍪 Teki Šmeki Jelovnik',
  description: 'Daily meals for kids',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  )
}
