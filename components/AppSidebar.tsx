'use client'

import { useEffect, useState, type ComponentProps } from 'react'
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
import { MobileSwipeSidebar } from './MobileSwipeSidebar'
import { ThemeSelect } from './ThemeSelect'
import { ModeSelect } from './ModeSelect'
import { LanguageSelect } from './LanguageSelect'
import { SelectRow } from './SelectRow'
import { PWAInstallPrompt } from './PWAInstallPrompt'
import { useThemeBranding } from '@/lib/theme-config'
import { useSettingsStore } from '@/app/[locale]/pages/settings/settings-store'
import packageJson from '@/package.json'
import { rollers } from '@/lib/rollers'

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const locale = useLocale()
  const navT = useTranslations('Navigation')
  const tPWA = useTranslations('PWA')
  const tFooter = useTranslations('Footer')
  const tLanguage = useTranslations('Language')
  const { setOpenMobile } = useSidebar()
  const branding = useThemeBranding()
  const sidebarOptions = useSettingsStore((state) => state.sidebarOptions)
  const [isClient, setIsClient] = useState(false)

  // We need client info because we render based on localstorage.
  // https://nextjs.org/docs/messages/react-hydration-error
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get version from package.json
  const appVersion = packageJson.version

  // Close sidebar on mobile when navigating
  const handleMobileNavigation = () => {
    setOpenMobile(false)
  }

  const mainNav = [
    {
      title: navT('home'),
      url: `/${locale}`,
      icon: null,
    },
    {
      title: navT('about'),
      url: `/${locale}/pages/about`,
      icon: null,
    },
    {
      title: navT('changelog'),
      url: `/${locale}/pages/changelog`,
      icon: null,
    },
    {
      title: navT('settings'),
      url: `/${locale}/pages/settings`,
      icon: null,
    },
  ]

  const rollersNav = rollers.map((roller) => {
    // Extract key from nameKey (e.g., "Navigation.shadowrun" -> "shadowrun")
    const nameKeyPart = roller.nameKey.split('.')[1]
    return {
      title: navT(nameKeyPart as any),
      url: `/${locale}${roller.link}`,
      icon: roller.icon,
    }
  })

  const isActive = (url: string) => {
    return pathname === url
  }

  if (!isClient) {
    return null
  }

  return (
    <Sidebar {...props}>
      <MobileSwipeSidebar direction="close">
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
            <SidebarGroupLabel>{navT('rollers')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {rollersNav.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={item.url} onClick={handleMobileNavigation}>
                          {Icon && <Icon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="space-y-4 p-4">
            {sidebarOptions === 'full' && (
            <>
              <SelectRow label={tLanguage('select')}>
                <LanguageSelect />
              </SelectRow>
              <ModeSelect />
              <ThemeSelect />
            </>
            )}
            {sidebarOptions === 'condensed' && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center">
                <ThemeSelect variant="compact" />
              </div>
              <div className="flex shrink-0 items-center">
                <ModeSelect variant="iconOnly" />
              </div>
            </div>
            )}
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
      </MobileSwipeSidebar>
    </Sidebar>
  )
}
