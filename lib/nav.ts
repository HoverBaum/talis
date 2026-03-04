import { Settings2, Info, ScrollText, type LucideIcon } from 'lucide-react'
import { rollers, type RollerNameKey, type RollerSubtitleKey } from './rollers'

export type NavCategory = 'roller' | 'page'
export type PageNameKey = 'about' | 'changelog' | 'settings'
export type PageSubtitleKey =
  | 'aboutDescription'
  | 'changelogDescription'
  | 'settingsDescription'
export type NavNameKey = RollerNameKey | PageNameKey
export type NavSubtitleKey = RollerSubtitleKey | PageSubtitleKey

export interface NavItem {
  id: string
  link: string
  icon: LucideIcon
  nameKey: NavNameKey
  subtitleKey: NavSubtitleKey
  category: NavCategory
}

export const rollerNavItems: NavItem[] = rollers.map((roller) => ({
  id: roller.id,
  link: roller.link,
  icon: roller.icon,
  nameKey: roller.nameKey,
  subtitleKey: roller.subtitleKey,
  category: 'roller',
}))

export const pageNavItems: NavItem[] = [
  {
    id: 'about',
    link: '/pages/about',
    icon: Info,
    nameKey: 'about',
    subtitleKey: 'aboutDescription',
    category: 'page',
  },
  {
    id: 'changelog',
    link: '/pages/changelog',
    icon: ScrollText,
    nameKey: 'changelog',
    subtitleKey: 'changelogDescription',
    category: 'page',
  },
  {
    id: 'settings',
    link: '/pages/settings',
    icon: Settings2,
    nameKey: 'settings',
    subtitleKey: 'settingsDescription',
    category: 'page',
  },
]

export const allNavItems: NavItem[] = [...rollerNavItems, ...pageNavItems]
