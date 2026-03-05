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
import { SelectRow } from './SelectRow'
import { PWAInstallPrompt } from './PWAInstallPrompt'
import { VersionInfo } from './VersionInfo'
import { useThemeBranding } from '@/lib/theme-config'
import { useSettingsStore } from '@/app/[locale]/pages/settings/settings-store'
import { rollerNavItems, pageNavItems } from '@/lib/nav'
import { useHasHydrated } from '@/hooks/useStoreHydration'

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const locale = useLocale()
  const navT = useTranslations('Navigation')
  const tLanguage = useTranslations('Language')
  const { setOpenMobile } = useSidebar()
  const branding = useThemeBranding()
  const hasHydrated = useHasHydrated(useSettingsStore)
  const sidebarOptions = useSettingsStore((state) => state.sidebarOptions)

  // Close sidebar on mobile when navigating.
  const handleMobileNavigation = () => {
    setOpenMobile(false)
  }

  const mainNav = [
    {
      title: navT('home'),
      url: `/${locale}`,
      icon: null,
    },
    ...pageNavItems.map((item) => {
      return {
        title: navT(item.nameKey),
        url: `/${locale}${item.link}`,
        icon: null,
      }
    }),
  ]

  const rollersNav = rollerNavItems.map((roller) => {
    return {
      title: navT(roller.nameKey),
      url: `/${locale}${roller.link}`,
      icon: roller.icon,
    }
  })

  const isActive = (url: string) => {
    return pathname === url
  }

  if (!hasHydrated) {
    return null
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href={`/${locale}`}
                className="flex items-center gap-2"
                onClick={handleMobileNavigation}
              >
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
                    <Link href={item.url} onClick={handleMobileNavigation}>
                      {item.title}
                    </Link>
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
          <VersionInfo stacked />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
