'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { ThemeSelect } from './ThemeSelect'
import { LanguageSelect } from './LanguageSelect'
import { PWAInstallPrompt } from './PWAInstallPrompt'
import talisLogo from '@/public/talis-dice.png'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('Navigation')
  const tPWA = useTranslations('PWA')
  
  // Get version from environment variable (set at build time in next.config.ts)
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'

  const mainNav = [
    {
      title: t('home'),
      url: `/${locale}`,
      icon: null,
    },
    {
      title: t('about'),
      url: `/${locale}/pages/about`,
      icon: null,
    },
    {
      title: t('changelog'),
      url: `/${locale}/pages/changelog`,
      icon: null,
    },
  ]

  const rollersNav = [
    {
      title: t('shadowrun'),
      url: `/${locale}/dice/shadowrun`,
      icon: null,
    },
    {
      title: t('d6'),
      url: `/${locale}/dice/d6`,
      icon: null,
    },
    {
      title: t('daggerheart'),
      url: `/${locale}/dice/daggerheart`,
      icon: null,
    },
  ]

  const isActive = (url: string) => {
    return pathname === url
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/${locale}`} className="flex items-center gap-2">
                <Image
                  src={talisLogo}
                  width={32}
                  height={32}
                  alt="Talis Logo"
                  className="rounded"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Talis</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t('rollers')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rollersNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-4 p-4">
          <LanguageSelect />
          <ThemeSelect withLabel={true} />
          <PWAInstallPrompt />
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              <span>
                {tPWA('version')}: {appVersion}
              </span>
            </div>
            <div>
              <span>
                Built by{' '}
                <a
                  href="https://hendrikwallbaum.de/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  Hendrik
                </a>{' '}
                on{' '}
                <a
                  href="https://github.com/HoverBaum/talis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-foreground"
                >
                  GitHub
                </a>
              </span>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
