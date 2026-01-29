'use client'

/**
 * AppSidebar renders the primary navigation and settings sidebar.
 *
 * Purpose: shows locale-aware links, roller navigation, and app controls.
 * Performance: mounted on most pages; avoids rendering until client hydration.
 * Accessibility: relies on Sidebar primitives and semantic links.
 * Constraints: depends on client-side storage for theme/mode state.
 * Usage: composed in the root layout within SidebarProvider.
 */
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
import { ThemeSelect } from './ThemeSelect'
import { ModeSelect } from './ModeSelect'
import { LanguageSelect } from './LanguageSelect'
import { SelectRow } from './SelectRow'
import { PWAInstallPrompt } from './PWAInstallPrompt'
import { useThemeBranding } from '@/lib/theme-config'
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

  const rollersNav = rollers.map((roller) => ({
    title: navT(roller.nameKey),
    url: `/${locale}${roller.link}`,
    icon: roller.icon,
  }))

  const isActive = (url: string) => {
    return pathname === url
  }

  if (!isClient) {
    return null
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
          <SelectRow label={tLanguage('select')}>
            <LanguageSelect />
          </SelectRow>
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
