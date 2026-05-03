'use client'

/**
 * Displays one Shadowrun roll with rule-aware metadata.
 *
 * Features:
 * - Highlights hits, glitches, and critical glitches
 * - Shows optional threshold/limit evaluations and explosion summaries
 * - Preserves quick scan readability by emphasizing the newest result
 *
 * Assumptions:
 * - Roll metadata is produced by ShadowrunRoller and may be absent for legacy entries
 * - Color emphasis follows optional theme-based highlights from config
 */
import { useTranslations } from 'next-intl'
import { DiceRollType, useShadowrunStore } from './shadowrun-store'
import { Badge } from '@/components/ui/badge'
import { d6Mapping } from '@/utils/dice-constants'

type DiceRollResultProps = {
  diceRoll: DiceRollType
  isFaded?: boolean
  isHighlighted?: boolean
}

export function DiceRollResult({
  diceRoll,
  isFaded,
  isHighlighted,
}: DiceRollResultProps) {
  const t = useTranslations('Roller.Shadowrun.DiceRollResult')
  const sortDice = useShadowrunStore((state) => state.config.sortDice)
  const useThemeHighlights = useShadowrunStore(
    (state) => state.config.useThemeHighlights
  )

  const rollPositiveClass = useThemeHighlights
    ? 'text-roll-positive'
    : 'text-blue-500'
  const rollNegativeClass = useThemeHighlights
    ? 'text-roll-negative'
    : 'text-yellow-500'

  const sortedResults = [...diceRoll.results].sort((a, b) => {
    if (sortDice) {
      return b - a
    }
    return 0
  })

  const shadowrunResult = diceRoll.shadowrun
  const hasThreshold = typeof shadowrunResult?.threshold === 'number'
  const hasLimit = typeof shadowrunResult?.appliedLimit === 'number'
  const hits = shadowrunResult?.hits ?? 0
  const rawHits = shadowrunResult?.rawHits ?? hits
  const ones = shadowrunResult?.ones ?? 0
  const extraDice = shadowrunResult?.extraDiceFromExplosions ?? 0

  return (
    <div
      className={`animate-fadeIn p-2 mb-6 ${isFaded && 'opacity-75'} ${
        isHighlighted && 'bg-muted border-2 rounded-lg'
      }`}
    >
      <span className={`${isHighlighted ? 'text-3xl' : 'text-xl'}`}>
        {hits} {hits === 1 ? t('hit') : t('hits')}
      </span>
      {shadowrunResult?.isGlitch && (
        <Badge
          variant="outline"
          className={`mx-2 ${useThemeHighlights ? 'bg-roll-negative text-roll-negative-foreground' : 'bg-yellow-500/20'}`}
        >
          {t('glitch')}
        </Badge>
      )}
      {shadowrunResult?.isCriticalGlitch && (
        <Badge variant="destructive" className="mx-2">
          {t('criticalGlitch')}
        </Badge>
      )}

      {(hasThreshold || hasLimit || extraDice > 0) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {hasThreshold && (
            <Badge
              variant={
                shadowrunResult?.thresholdMet ? 'default' : 'secondary'
              }
              className={
                shadowrunResult?.thresholdMet
                  ? ''
                  : 'bg-muted text-muted-foreground'
              }
            >
              {shadowrunResult?.thresholdMet
                ? t('thresholdMet', {
                    threshold: shadowrunResult.threshold,
                  })
                : t('thresholdMissed', {
                    threshold: shadowrunResult?.threshold ?? 0,
                  })}
            </Badge>
          )}
          {hasLimit && rawHits > hits && (
            <Badge variant="outline">
              {t('limitApplied', {
                rawHits,
                hits,
                limit: shadowrunResult?.appliedLimit ?? 0,
              })}
            </Badge>
          )}
          {extraDice > 0 && (
            <Badge variant="outline">
              {t('extraDice', { count: extraDice })}
            </Badge>
          )}
        </div>
      )}

      <span
        className={`text-4xl flex flex-wrap font-emoji ${isHighlighted && 'text-5xl'}`}
      >
        {sortedResults.map((result, j) => {
          const isHit = result >= 5
          const isOne = result === 1
          const isCriticalGlitch = isOne && shadowrunResult?.isCriticalGlitch
          const faceColorClass = (() => {
            if (isHit) return rollPositiveClass
            if (isCriticalGlitch) return 'text-destructive'
            if (isOne) return rollNegativeClass
            if (result > 1 && result < 5) return 'text-muted-foreground'
            return ''
          })()

          return (
            <span key={j} className={`mr-1 ${faceColorClass}`}>
              {d6Mapping[result as 1 | 2 | 3 | 4 | 5 | 6]}
            </span>
          )
        })}
      </span>

      <span className="block text-xs text-muted-foreground mt-2">
        #{diceRoll.id} - {new Date(diceRoll.timestamp).toLocaleTimeString()} -{' '}
        {diceRoll.results.length} {t('dice')} - {ones} {t('ones')}
      </span>
    </div>
  )
}
