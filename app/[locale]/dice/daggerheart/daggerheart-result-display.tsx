'use client'

import { useTranslations } from 'next-intl'
import { DaggerheartRoll } from '@/stores/daggerheart-store'
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
  const isCritical = roll.hope === roll.fear

  let hopeGrow = 1
  let fearGrow = 1

  if (isCritical) {
    hopeGrow = 1
    fearGrow = 1
  } else if (roll.hope > roll.fear) {
    hopeGrow = 2
    fearGrow = 1
  } else if (roll.fear > roll.hope) {
    hopeGrow = 1
    fearGrow = 2
  }

  return (
    <div
      className={`animate-fadeIn p-2 mb-6 ${
        isHighlighted ? 'bg-muted p-4 text-xl border-2 rounded-lg' : 'text-md'
      }`}
    >
      <div>
        <span>
          {!isCritical && (
            <span>{roll.fear > roll.hope ? t('fear') : t('hope')}</span>
          )}
          {isCritical && <span>{t('criticalSuccess')}</span>}{' '}
          {roll.fear + roll.hope}
        </span>
      </div>
      <div className="flex text-center">
        <div
          className="flex flex-col items-center mx-1 rounded bg-blue-200 text-black p-2"
          style={{ flexGrow: hopeGrow }}
        >
          <span className="font-semibold">
            {t('hope')} {roll.hope}
          </span>
        </div>
        <div
          className="flex flex-col items-center mx-1 rounded bg-red-200 text-black p-2"
          style={{ flexGrow: fearGrow }}
        >
          <span className="font-semibold">
            {t('fear')} {roll.fear}
          </span>
        </div>
      </div>
      <div className="flex items-center mt-2">
        {isCritical && (
          <Badge variant="default" className="bg-accent">
            {t('criticalSuccess')}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground ml-2">
          {new Date(roll.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}

