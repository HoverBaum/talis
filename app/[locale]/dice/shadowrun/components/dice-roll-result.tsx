'use client'

import { useTranslations } from 'next-intl'
import { DiceRollType } from '@/stores/shadowrun-store'
import { useShadowrunStore } from '@/stores/shadowrun-store'
import { Badge } from '@/components/ui/badge'

const d6Mapping = {
    1: '⚀',
    2: '⚁',
    3: '⚂',
    4: '⚃',
    5: '⚄',
    6: '⚅',
}

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

    const sortedResults = [...diceRoll.results].sort((a, b) => {
        if (sortDice) {
            return b - a
        }
        return 0
    })

    return (
        <div
            className={`animate-fadeIn p-2 mb-6 ${isFaded && 'opacity-75'} ${isHighlighted && 'bg-muted border-2 rounded-lg'
                }`}
        >
            <span className={`${isHighlighted ? 'text-3xl' : 'text-xl'}`}>
                {diceRoll.shadowrun?.hits}{' '}
                {diceRoll.shadowrun?.hits === 1 ? t('hit') : t('hits')}
            </span>
            {diceRoll.shadowrun?.isGlitch && (
                <Badge variant="outline" className="mx-2 bg-yellow-500/20">
                    {t('glitch')}
                </Badge>
            )}
            {diceRoll.shadowrun?.isCriticalGlitch && (
                <Badge variant="destructive" className="mx-2">
                    {t('criticalGlitch')}
                </Badge>
            )}
            <span
                className={`text-4xl flex flex-wrap font-emoji ${isHighlighted && 'text-5xl'}`}
            >
                {sortedResults.map((result, j) => {
                    const isHit = result >= 5
                    const isOne = result === 1
                    const isCriticalGlitch =
                        isOne && diceRoll.shadowrun?.isCriticalGlitch

                    return (
                        <span
                            key={j}
                            className={`mr-1 ${isHit ? 'text-blue-500' : ''
                                } ${isOne && !isCriticalGlitch ? 'text-yellow-500' : ''
                                } ${isCriticalGlitch ? 'text-red-500' : ''
                                } ${result > 1 && result < 5 ? 'text-muted-foreground' : ''
                                }`}
                        >
                            {d6Mapping[result as 1 | 2 | 3 | 4 | 5 | 6]}
                        </span>
                    )
                })}
            </span>

            <span className="block text-xs text-muted-foreground mt-2">
                #{diceRoll.id} - {new Date(diceRoll.timestamp).toLocaleTimeString()} -{' '}
                {diceRoll.results.length} {t('dice')}
            </span>
        </div>
    )
}

