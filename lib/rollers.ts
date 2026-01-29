import { Layers, Dices, Pentagon, SquareSplitHorizontal, Coins, type LucideIcon } from 'lucide-react'
import type Messages from '@/i18n/en.json'

type NavigationKey = keyof Messages['Navigation']
type HomeKey = keyof Messages['Home']

export interface Roller {
  id: string
  link: string
  icon: LucideIcon
  nameKey: NavigationKey
  subtitleKey: HomeKey
}

/**
 * Roller definitions for Talis dice rollers.
 * Icons represent dice mechanics, not brands:
 * - Shadowrun: Layers (representing layered dice mechanics)
 * - D6: Dices (representing standard six-sided dice)
 * - Daggerheart: SquareSplitHorizontal (representing dual/split dice mechanics)
 * - Polyhedral: Pentagon (representing various geometric dice shapes)
 */
export const rollers: Roller[] = [
  {
    id: 'shadowrun',
    link: '/dice/shadowrun',
    icon: Layers,
    nameKey: 'shadowrun',
    subtitleKey: 'shadowrunDescription',
  },
  {
    id: 'd6',
    link: '/dice/d6',
    icon: Dices,
    nameKey: 'd6',
    subtitleKey: 'd6Description',
  },
  {
    id: 'daggerheart',
    link: '/dice/daggerheart',
    icon: SquareSplitHorizontal,
    nameKey: 'daggerheart',
    subtitleKey: 'daggerheartDescription',
  },
  {
    id: 'polyhedral',
    link: '/dice/polyhedral',
    icon: Pentagon,
    nameKey: 'polyhedral',
    subtitleKey: 'polyhedralDescription',
  },
  {
    id: 'coin',
    link: '/dice/coin',
    icon: Coins,
    nameKey: 'coin',
    subtitleKey: 'coinDescription',
  },
]

/**
 * Get roller information by ID
 */
export function getRollerById(id: string): Roller | undefined {
  return rollers.find((roller) => roller.id === id)
}
