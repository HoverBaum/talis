import { DictionaryType } from 'dictionaries/dictionanier'
import { MinusIcon } from '@/components/icons/MinusIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { ExtractProperty } from 'utils/extractProperty'
import { useDict } from 'dictionaries/useDict'
import { Button } from '@/components/ui/button'

type FreeDiceInputProps = {
  numberOfDice: number
  onNewNumber: (dice: number) => void
  maxDiceAmount: number
  className?: string
  variant?: 'default' | 'small'
}

export const FreeDiceInput = ({
  numberOfDice,
  onNewNumber,
  maxDiceAmount,
  className,
  variant = 'default',
}: FreeDiceInputProps) => {
  const isSmall = variant === 'small'
  const dict = useDict('Components.FreeInput')

  return (
    <div className={`flex items-center ${className}`}>
      <label>{dict.numberOfDice} </label>
      <input
        type="text"
        placeholder="0"
        className={`border border-input rounded-md w-14 text-center ml-2 px-2 ${
          isSmall ? 'h-8 text-sm' : 'h-10'
        }`}
        value={numberOfDice > 0 ? numberOfDice : ''}
        onChange={(e) => {
          if (isNaN(parseInt(e.target.value))) return onNewNumber(0)
          onNewNumber(parseInt(e.target.value))
        }}
      />

      <Button
        variant="outline"
        size={isSmall ? "sm" : "icon"}
        className="ml-4"
        disabled={numberOfDice <= 1}
        onClick={() => {
          if (numberOfDice <= 1) return
          onNewNumber(numberOfDice - 1)
        }}
      >
        <MinusIcon />
      </Button>
      <Button
        variant="outline"
        size={isSmall ? "sm" : "icon"}
        className="ml-2"
        disabled={numberOfDice >= maxDiceAmount}
        onClick={() => {
          if (numberOfDice >= maxDiceAmount) return
          onNewNumber(numberOfDice + 1)
        }}
      >
        <PlusIcon />
      </Button>
    </div>
  )
}
