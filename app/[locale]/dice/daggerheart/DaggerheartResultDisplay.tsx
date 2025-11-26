'use client'

import { useTranslations } from 'next-intl'
import { DaggerheartRoll, useDaggerheartStore } from './daggerheart-store'
import { Badge } from '@/components/ui/badge'

type DaggerheartResultDisplayProps = {
  roll: DaggerheartRoll
  isHighlighted?: boolean
}

export function DaggerheartResultDisplay({
  roll,
  isHighlighted = false,
}: DaggerheartResultDisplayProps) {
  const t = useTranslations('Roller.Daggerheart')
  const useThemeColors = useDaggerheartStore(
    (state) => state.config.useThemeColors
  )
  const isCritical = roll.hope === roll.fear

  // Determine grid columns based on which value is larger
  let gridCols = 'grid-cols-2' // Default for critical (equal values)
  if (!isCritical) {
    gridCols =
      roll.hope > roll.fear ? 'grid-cols-[2fr_1fr]' : 'grid-cols-[1fr_2fr]'
  }

  const hopeClasses = useThemeColors
    ? 'border-roll-positive bg-roll-positive/50 text-roll-positive-foreground dark:text-foreground dark:bg-roll-positive/10'
    : 'border-yellow-200 bg-yellow-200/50 text-foreground dark:bg-yellow-900/10'
  const fearClasses = useThemeColors
    ? 'border-roll-negative bg-roll-negative/50 text-roll-negative-foreground dark:text-foreground dark:bg-roll-negative/10'
    : 'border-purple-200 bg-purple-200/50 text-foreground dark:bg-purple-900/10'

  return (
    <div
      className={`animate-fadeIn p-2 mb-6 ${
        isHighlighted ? 'bg-muted p-4 text-xl border-2 rounded-lg' : 'text-md'
      }`}
    >
      <div
        className={`mb-1 flex items-center ${
          isHighlighted ? 'font-bold mb-2' : ''
        }`}
      >
        {!isCritical && (
          <>
            {roll.hope > roll.fear && (
              <Badge variant="default" className={hopeClasses}>
                {t('hope')}
              </Badge>
            )}
            {roll.fear > roll.hope && (
              <Badge variant="default" className={fearClasses}>
                {t('fear')}
              </Badge>
            )}
          </>
        )}
        {isCritical && <Badge variant="default">{t('criticalSuccess')}</Badge>}
        <span className="ml-1">{roll.fear + roll.hope}</span>
      </div>
      <div className={`grid ${gridCols} gap-2 text-center`}>
        <div
          className={`flex flex-col items-center rounded p-2 border ${hopeClasses}`}
        >
          <span className="whitespace-nowrap">
            {t('hope')} {roll.hope}
          </span>
        </div>
        <div
          className={`flex flex-col items-center rounded p-2 border ${fearClasses}`}
        >
          <span className="whitespace-nowrap">
            {t('fear')} {roll.fear}
          </span>
        </div>
      </div>
      <div className="flex items-center mt-2">
        <span className="text-xs text-muted-foreground ml-2">
          {new Date(roll.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
