'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'

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

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm">{t('numberOfDice')}</label>
      <Input
        type="text"
        placeholder="0"
        className="w-14 text-center"
        value={numberOfDice > 0 ? numberOfDice : ''}
        onChange={(e) => {
          if (isNaN(parseInt(e.target.value))) return onNewNumber(0)
          onNewNumber(parseInt(e.target.value))
        }}
      />

      <Button
        variant="outline"
        size={variant === 'small' ? 'sm' : 'default'}
        disabled={numberOfDice <= 1}
        onClick={() => {
          if (numberOfDice <= 1) return
          onNewNumber(numberOfDice - 1)
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
          onNewNumber(numberOfDice + 1)
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

