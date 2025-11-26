'use client'

import { type ComponentProps } from 'react'
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
  useSidebar,
} from '@/components/ui/sidebar'
import { ThemeSelect } from './ThemeSelect'
import { ModeSelect } from './ModeSelect'
import { LanguageSelect } from './LanguageSelect'
import { PWAInstallPrompt } from './PWAInstallPrompt'
import { useThemeBranding } from '@/lib/theme-config'
import packageJson from '@/package.json'

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('Navigation')
  const tPWA = useTranslations('PWA')
  const tFooter = useTranslations('Footer')
  const { setOpenMobile } = useSidebar()
  const branding = useThemeBranding()

  // Get version from package.json
  const appVersion = packageJson.version

  // Close sidebar on mobile when navigating
  const handleMobileNavigation = () => {
    setOpenMobile(false)
  }

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
    {
      title: t('polyhedral'),
      url: `/${locale}/dice/polyhedral`,
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
              <Link href={`/${locale}`} className="flex items-center gap-2" onClick={handleMobileNavigation}>
                <Image
                  src={branding.logo}
                  width={32}
                  height={32}
                  alt={`${branding.brandName} Logo`}
                  className="rounded"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{branding.brandName}</span>
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
                    <Link href={item.url} onClick={handleMobileNavigation}>{item.title}</Link>
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
                    <Link href={item.url} onClick={handleMobileNavigation}>{item.title}</Link>
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
          <ModeSelect />
          <ThemeSelect />
          <PWAInstallPrompt />
          <div className="text-xs text-muted-foreground space-y-1">
            <div>
              <span>
                {tPWA('version')}: {appVersion}
              </span>
            </div>
            <div>
              <span>
                {tFooter('builtBy')}{' '}
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
