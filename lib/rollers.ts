import { Layers, Dices, Pentagon, SquareSplitHorizontal, type LucideIcon } from 'lucide-react'

export interface Roller {
  id: string
  link: string
  icon: LucideIcon
  nameKey: string
  subtitleKey: string
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
    nameKey: 'Navigation.shadowrun',
    subtitleKey: 'Home.shadowrunDescription',
  },
  {
    id: 'd6',
    link: '/dice/d6',
    icon: Dices,
    nameKey: 'Navigation.d6',
    subtitleKey: 'Home.d6Description',
  },
  {
    id: 'daggerheart',
    link: '/dice/daggerheart',
    icon: SquareSplitHorizontal,
    nameKey: 'Navigation.daggerheart',
    subtitleKey: 'Home.daggerheartDescription',
  },
  {
    id: 'polyhedral',
    link: '/dice/polyhedral',
    icon: Pentagon,
    nameKey: 'Navigation.polyhedral',
    subtitleKey: 'Home.polyhedralDescription',
  },
]

/**
 * Get roller information by ID
 */
export function getRollerById(id: string): Roller | undefined {
  return rollers.find((roller) => roller.id === id)
}
