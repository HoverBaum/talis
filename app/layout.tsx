import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './Providers'
import { StoreSetup } from './StoreSetup'
import { Drawer } from './Drawer'

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
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${inter.className} min-h-screen bg-base-100`}
      >
        <Providers>
          <div className="drawer">
            <input
              id="talis-drawer"
              type="checkbox"
              className="drawer-toggle"
            />
            <div className="drawer-content">
              <StoreSetup />
              {children}
            </div>
            <Drawer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
