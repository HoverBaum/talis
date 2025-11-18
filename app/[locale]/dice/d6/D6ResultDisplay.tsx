'use client'

import { useTranslations } from 'next-intl'
import { D6RollResult } from '@/stores/d6-store'
import { useD6Store } from '@/stores/d6-store'
import { d6Mapping } from '@/utils/dice-constants'

type D6ResultDisplayProps = {
  diceRoll: D6RollResult
  isHighlighted?: boolean
}

export function D6ResultDisplay({
  diceRoll,
  isHighlighted = false,
}: D6ResultDisplayProps) {
  const t = useTranslations('General')
  const sortDice = useD6Store((state) => state.config.sortDice)
  const sumDice = useD6Store((state) => state.config.sumDice)

  const sortedResults = [...diceRoll.results].sort((a, b) => {
    if (sortDice) {
      return b - a
    }
    return 0
  })

  return (
    <div
      className={`animate-fadeIn p-2 mb-4 ${isHighlighted && 'bg-muted border-2 rounded-lg'
        }`}
    >
      {sumDice && (
        <span className={`${isHighlighted ? 'text-3xl' : 'text-xl'}`}>
          {diceRoll.results.reduce((acc, curr) => acc + curr, 0)}{' '}
        </span>
      )}
      <span
        className={`text-4xl flex flex-wrap font-emoji ${isHighlighted && 'text-5xl'}`}
      >
        {sortedResults.map((result, j) => {
          return (
            <span key={j} className="mr-1">
              {d6Mapping[result as 1 | 2 | 3 | 4 | 5 | 6]}
            </span>
          )
        })}
      </span>

      <span className="block text-xs text-muted-foreground mt-2">
        {new Date(diceRoll.timestamp).toLocaleTimeString()} -{' '}
        {diceRoll.results.length} {t('dice')}
      </span>
    </div>
  )
}

