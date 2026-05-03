'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'
import { sanitizeIntegerInRange } from '@/utils/number-utils'

type FreeDiceInputProps = {
  numberOfDice: number
  onNewNumber: (dice: number) => void
  maxDiceAmount: number
  className?: string
  variant?: 'default' | 'small'
}

export function FreeDiceInput({
  numberOfDice,
  onNewNumber,
  maxDiceAmount,
  className,
  variant = 'default',
}: FreeDiceInputProps) {
  const t = useTranslations('Components.FreeInput')
  const minDiceAmount = 1

  const setClampedNumber = (value: number) => {
    onNewNumber(
      sanitizeIntegerInRange(value, {
        min: minDiceAmount,
        max: maxDiceAmount,
        fallback: minDiceAmount,
      })
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm">{t('numberOfDice')}</label>
      <Input
        type="number"
        min={minDiceAmount}
        max={maxDiceAmount}
        placeholder="1"
        className="w-14 text-center"
        value={numberOfDice}
        onChange={(e) => {
          setClampedNumber(Number(e.target.value))
        }}
      />

      <Button
        variant="outline"
        size={variant === 'small' ? 'sm' : 'default'}
        disabled={numberOfDice <= 1}
        onClick={() => {
          if (numberOfDice <= minDiceAmount) return
          setClampedNumber(numberOfDice - 1)
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
          setClampedNumber(numberOfDice + 1)
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
