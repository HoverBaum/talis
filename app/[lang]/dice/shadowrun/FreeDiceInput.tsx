import { DictionaryType } from 'dictionaries/dictionanier'
import { MinusIcon } from '@/components/icons/MinusIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { ExtractProperty } from 'utils/extractProperty'
import { useDict } from 'dictionaries/useDict'

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
        className={`input input-bordered w-14 text-center ml-2 ${
          isSmall ? 'input-sm' : ''
        }`}
        value={numberOfDice > 0 ? numberOfDice : ''}
        onChange={(e) => {
          if (isNaN(parseInt(e.target.value))) return onNewNumber(0)
          onNewNumber(parseInt(e.target.value))
        }}
      />

      <button
        className={`btn btn-square ml-4  ${isSmall ? 'btn-sm' : ''}`}
        disabled={numberOfDice <= 1}
        onClick={() => {
          if (numberOfDice <= 1) return
          onNewNumber(numberOfDice - 1)
        }}
      >
        <MinusIcon />
      </button>
      <button
        className={`btn btn-square ml-2  ${isSmall ? 'btn-sm' : ''}`}
        disabled={numberOfDice >= maxDiceAmount}
        onClick={() => {
          if (numberOfDice >= maxDiceAmount) return
          onNewNumber(numberOfDice + 1)
        }}
      >
        <PlusIcon />
      </button>
    </div>
  )
}
