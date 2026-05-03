'use client'

/**
 * Numeric dice pool input for Shadowrun and quick-button editing.
 *
 * Features:
 * - Direct numeric entry with immediate sanitation to valid integer ranges
 * - Increment/decrement controls that honor configured min/max bounds
 * - Reusable compact variant for quick-button rows in the configuration page
 *
 * Assumptions:
 * - Parent store clamps values again for persistence safety
 * - Min defaults to 0 for main roller input, and callers can set min=1 where needed
 */
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'

type FreeDiceInputProps = {
  numberOfDice: number
  onNewNumber: (dice: number) => void
  maxDiceAmount: number
  minDiceAmount?: number
  className?: string
  variant?: 'default' | 'small'
}

export function FreeDiceInput({
  numberOfDice,
  onNewNumber,
  maxDiceAmount,
  minDiceAmount = 0,
  className,
  variant = 'default',
}: FreeDiceInputProps) {
  const t = useTranslations('Components.FreeInput')
  const sanitize = (value: number) =>
    Math.min(maxDiceAmount, Math.max(minDiceAmount, Math.floor(value)))

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm">{t('numberOfDice')}</label>
      <Input
        type="number"
        placeholder="0"
        className="w-14 text-center"
        min={minDiceAmount}
        max={maxDiceAmount}
        value={numberOfDice >= minDiceAmount ? numberOfDice : minDiceAmount}
        onChange={(e) => {
          if (!e.target.value) {
            onNewNumber(minDiceAmount)
            return
          }

          const parsed = Number(e.target.value)
          if (Number.isNaN(parsed)) return
          onNewNumber(sanitize(parsed))
        }}
      />

      <Button
        variant="outline"
        size={variant === 'small' ? 'sm' : 'default'}
        disabled={numberOfDice <= minDiceAmount}
        onClick={() => {
          if (numberOfDice <= minDiceAmount) return
          onNewNumber(sanitize(numberOfDice - 1))
        }}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size={variant === 'small' ? 'sm' : 'default'}
        disabled={numberOfDice >= maxDiceAmount}
        onClick={() => {
          if (numberOfDice >= maxDiceAmount) return
          onNewNumber(sanitize(numberOfDice + 1))
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
