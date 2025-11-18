'use client'

import { usePathname } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from './theme-provider'
import { AppSidebar } from './app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'

type ProvidersWrapperProps = {
  messages: any
  locale: string
  children: React.ReactNode
}

// This component must be a client component to use contexts
export function ProvidersWrapper({
  messages,
  locale,
  children,
}: ProvidersWrapperProps) {
  const pathname = usePathname()
  const isPagesRoute = pathname?.includes('/pages/')

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ThemeProvider defaultTheme="system" storageKey="talis-theme">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header
              className={`flex h-16 shrink-0 items-center gap-2 border-b px-4 ${
                isPagesRoute ? 'sticky top-0 z-10 bg-background' : ''
              }`}
            >
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </header>
            <main
              className={`flex-1 min-h-0 ${
                isPagesRoute ? 'overflow-y-auto' : 'overflow-hidden'
              }`}
            >
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
