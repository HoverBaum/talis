'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ThemeSelect } from '../app/[lang]/ThemeSelect'
import { LanguageSelect } from '../app/[lang]/LanguageSelect'
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
import talisLogo from '@/public/talis-dice.png'

const navItems = [
  { title: 'Talis - Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Changelog', href: '/changelog' },
]

const rollers = [
  { title: 'Shadowrun', href: '/dice/shadowrun' },
  { title: 'D6 Roller', href: '/dice/d6' },
  { title: 'Daggerheart (beta)', href: '/dice/daggerheart' },
]

export const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={talisLogo}
                  width={32}
                  height={32}
                  alt="Talis Logo"
                  className="rounded-lg"
                />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-lg">Talis</span>
                  <span className="text-xs opacity-75">Dice Rolling</span>
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
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Rollers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rollers.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-4 px-2 pb-2">
          <LanguageSelect />
          <ThemeSelect withLabel={true} />
          <div className="text-xs opacity-75">
            Build by{' '}
            <Link
              className="underline"
              target="_blank"
              href="https://hendrikwallbaum.de/"
            >
              Hendrik
            </Link>{' '}
            on{' '}
            <Link
              className="underline"
              target="_blank"
              href="https://github.com/HoverBaum/talis"
            >
              GitHub
            </Link>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
