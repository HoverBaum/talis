import { Settings2, Info, ScrollText, type LucideIcon } from 'lucide-react'
import { rollers } from './rollers'

export type NavCategory = 'roller' | 'page'

export interface NavItem {
  id: string
  link: string
  icon: LucideIcon
  nameKey: string
  subtitleKey: string
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
    nameKey: 'Navigation.about',
    subtitleKey: 'Home.aboutDescription',
    category: 'page',
  },
  {
    id: 'changelog',
    link: '/pages/changelog',
    icon: ScrollText,
    nameKey: 'Navigation.changelog',
    subtitleKey: 'Home.changelogDescription',
    category: 'page',
  },
  {
    id: 'settings',
    link: '/pages/settings',
    icon: Settings2,
    nameKey: 'Navigation.settings',
    subtitleKey: 'Home.settingsDescription',
    category: 'page',
  },
]

export const allNavItems: NavItem[] = [...rollerNavItems, ...pageNavItems]
