'use client'

import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from './ThemeProvider'
import { AppSidebar } from './AppSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import { PageTitle } from './PageTitle'
import { PageTitleProvider } from './PageTitleProvider'
import { PWAUpdatePrompt } from './PWAUpdatePrompt'
import { RegisterServiceWorker } from '@/app/register-sw'
import { useIOSNavigation } from '@/hooks/use-ios-navigation'
import { IosBackButton } from './IosBackButton'

type ProvidersWrapperProps = {
  messages: Record<string, unknown>
  locale: string
  timeZone?: string
  children: React.ReactNode
}

// This component must be a client component to use contexts
export function ProvidersWrapper({
  messages,
  locale,
  timeZone = 'UTC',
  children,
}: ProvidersWrapperProps) {
  const { isIOSNavigationEnabled } = useIOSNavigation()

  return (
    <NextIntlClientProvider
      messages={messages}
      locale={locale}
      timeZone={timeZone}
    >
      <ThemeProvider>
        <PageTitleProvider>
          <SidebarProvider>
            {!isIOSNavigationEnabled && <AppSidebar />}
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 overflow-hidden border-b bg-background px-4">
                {isIOSNavigationEnabled ? (
                  <IosBackButton />
                ) : (
                  <SidebarTrigger className="-ml-1" />
                )}
                <Separator orientation="vertical" className="mr-2 h-4" />
                <PageTitle />
              </header>
              <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
            </SidebarInset>
          </SidebarProvider>
        </PageTitleProvider>
      </ThemeProvider>
      <RegisterServiceWorker />
      <PWAUpdatePrompt />
    </NextIntlClientProvider>
  )
}
