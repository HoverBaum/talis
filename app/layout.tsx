import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './Providers'
import { StoreSetup } from './StoreSetup'

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
        className={`${inter.className} min-h-screen bg-base-100`}
      >
        <Providers>
          <>
            <StoreSetup />
            {children}
          </>
        </Providers>
      </body>
    </html>
  )
}
