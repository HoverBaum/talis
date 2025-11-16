import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './Providers'
import { StoreSetup } from './StoreSetup'
import { Locale } from 'i18n-config'
import { ServerTranslationContext } from 'dictionaries/ServerTranslationContext'
import { AppSidebar } from '@/components/AppSidebar'
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { HeaderProvider } from '@/components/header-context'
import { DynamicHeader } from './DynamicHeader'

export const metadata: Metadata = {
  title: 'Talis - dice rolling',
  description: 'Roll dice for Pen and Paper.',
}

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        suppressHydrationWarning={true}
        className="h-screen overflow-hidden"
      >
        <Providers>
          <ServerTranslationContext lang={lang}>
            <HeaderProvider>
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="flex flex-col h-screen">
                  <DynamicHeader />
                  <div className="flex-1 overflow-hidden">
                    <StoreSetup />
                    {children}
                  </div>
                </SidebarInset>
              </SidebarProvider>
            </HeaderProvider>
          </ServerTranslationContext>
        </Providers>
      </body>
    </html>
  )
}
