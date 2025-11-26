'use client'

/**
 * Displays the results of a polyhedral dice roll.
 * 
 * Features:
 * - Shows individual dice results as numbers with the dice type (e.g., "d20") prominently displayed
 * - Supports optional sorting of results (highest to lowest)
 * - Supports optional sum display
 * - Shows timestamp and roll notation in a small note below
 * - Highlights the most recent roll with larger text and background styling
 * 
 * Performance considerations:
 * - Rendered in a list that can grow with roll history
 * - Uses simple number rendering (no emoji mapping) for performance
 * 
 * Assumptions:
 * - Expects a valid PolyhedralRollResult with results array and diceType
 * - Assumes results array contains numbers within valid range for the dice type
 * 
 * Used by PolyhedralRoller to display roll history in the result area.
 */
import { useTranslations } from 'next-intl'
import { PolyhedralRollResult, usePolyhedralStore } from './polyhedral-store'

type PolyhedralResultDisplayProps = {
    diceRoll: PolyhedralRollResult
    isHighlighted?: boolean
}

export function PolyhedralResultDisplay({
    diceRoll,
    isHighlighted = false,
}: PolyhedralResultDisplayProps) {
    const t = useTranslations('General')
    const sortDice = usePolyhedralStore((state) => state.config.sortDice)
    const sumDice = usePolyhedralStore((state) => state.config.sumDice)

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
            <div className="flex items-baseline gap-2 flex-wrap">
                {sumDice && (
                    <span className={`${isHighlighted ? 'text-3xl' : 'text-xl'}`}>
                        {diceRoll.results.reduce((acc, curr) => acc + curr, 0)}{' '}
                    </span>
                )}
                <span
                    className={`text-4xl flex flex-wrap items-baseline ${isHighlighted && 'text-5xl'}`}
                >
                    {sortedResults.map((result, j) => {
                        return (
                            <span key={j} className="mr-2">
                                {result}
                            </span>
                        )
                    })}
                </span>
                <span className={`${isHighlighted ? 'text-2xl' : 'text-xl'} font-semibold text-muted-foreground`}>
                    d{diceRoll.diceType}
                </span>
            </div>

            <span className="block text-xs text-muted-foreground mt-2">
                {new Date(diceRoll.timestamp).toLocaleTimeString()} -{' '}
                {diceRoll.results.length}d{diceRoll.diceType}
            </span>
        </div>
    )
}

