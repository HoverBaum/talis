import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from './Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Talis - dice rolling',
  description: 'Roll dice for Pen and Paper.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} flex flex-col min-h-screen`}
      >
        <Navbar></Navbar>
        <main className="flex-grow basis-0">{children}</main>
      </body>
    </html>
  )
}
