'use client'

/**
 * Displays the result of a coin flip with optional color differentiation for heads/tails.
 *
 * Features:
 * - Shows the flip result (heads or tails value) with appropriate color (configurable)
 * - Color modes: None (no color classes), Positive/Negative (heads = roll-positive, tails = roll-negative)
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
  const resultColorMode = useCoinStore((state) => state.config.resultColorMode)

  const displayValue =
    flip.result === 'heads'
      ? getDisplayValue(flip.coinType.headsValue, t)
      : getDisplayValue(flip.coinType.tailsValue, t)

  const coinDisplayName = getDisplayValue(flip.coinType.displayName, t)

  const mode = resultColorMode ?? 'positive-negative'
  const colorClass =
    mode === 'positive-negative'
      ? flip.result === 'heads'
        ? 'text-roll-positive'
        : 'text-roll-negative'
      : ''

  return (
    <div
      className={`animate-fadeIn p-2 mb-4 ${isHighlighted && 'bg-muted border-2 rounded-lg'
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
