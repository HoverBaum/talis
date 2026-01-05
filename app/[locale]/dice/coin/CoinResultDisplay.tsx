'use client'

/**
 * Displays the result of a coin flip with optional color differentiation for heads/tails.
 *
 * Features:
 * - Shows the flip result (heads or tails value) with appropriate color (configurable)
 * - When colored results enabled: Heads use roll-positive color, Tails use roll-negative color
 * - Shows timestamp and coin type in a small note below
 * - Highlights the most recent flip with larger text and background styling
 * - Older (non-highlighted) results have their display value shown with reduced opacity
 *
 * Performance considerations:
 * - Rendered in a list that can grow with flip history
 * - Uses simple text rendering for performance
 *
 * Assumptions:
 * - Expects a valid CoinFlipResult with coinType and result
 * - Translation function is passed for translatable coin values
 *
 * Used by CoinRoller to display coin flip history in the result area.
 */
import { useTranslations } from 'next-intl'
import { type CoinFlipResult, useCoinStore } from './coin-store'

type CoinResultDisplayProps = {
  flip: CoinFlipResult
  isHighlighted?: boolean
}

/**
 * Helper to get the display value, handling translation keys.
 */
const getDisplayValue = (
  value: string,
  t: ReturnType<typeof useTranslations<'Roller'>>
): string => {
  // Check if this is a translation key (starts with 'Coin.')
  if (value.startsWith('Coin.')) {
    const key = value.replace('Coin.', '')
    return t(`Coin.${key}` as Parameters<typeof t>[0])
  }
  return value
}

export const CoinResultDisplay = ({
  flip,
  isHighlighted = false,
}: CoinResultDisplayProps) => {
  const t = useTranslations('Roller')
  const useColoredResults = useCoinStore((state) => state.config.useColoredResults)

  const displayValue =
    flip.result === 'heads'
      ? getDisplayValue(flip.coinType.headsValue, t)
      : getDisplayValue(flip.coinType.tailsValue, t)

  const coinDisplayName = getDisplayValue(flip.coinType.displayName, t)

  // Color classes based on result (only when colored results are enabled)
  // Using roll-positive for heads (success/positive outcome) and roll-negative for tails
  const colorClass = useColoredResults
    ? flip.result === 'heads'
      ? 'text-roll-positive'
      : 'text-roll-negative'
    : ''

  return (
    <div
      className={`animate-fadeIn p-2 mb-4 ${
        isHighlighted && 'bg-muted border-2 rounded-lg'
      }`}
    >
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className={`${isHighlighted ? 'text-5xl' : 'text-4xl opacity-50'} font-bold ${colorClass}`}
        >
          {displayValue}
        </span>
      </div>

      <span className="block text-xs text-muted-foreground mt-2">
        {new Date(flip.timestamp).toLocaleTimeString()} - {coinDisplayName}
      </span>
    </div>
  )
}
