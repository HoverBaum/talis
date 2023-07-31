import { MinusIcon } from '@/components/icons/MinusIcon'
import { PlusIcon } from '@/components/icons/PlusIcon'

type FreeDiceInputProps = {
  numberOfDice: number
  onNewNumber: (dice: number) => void
  maxDiceAmount: number
}

export const FreeDiceInput = ({
  numberOfDice,
  onNewNumber,
  maxDiceAmount,
}: FreeDiceInputProps) => {
  return (
    <div className="flex items-center">
      <label>Number of dice: </label>
      <input
        type="text"
        placeholder="0"
        className="input input-bordered w-14 text-center ml-2"
        value={numberOfDice > 0 ? numberOfDice : ''}
        onChange={(e) => {
          if (isNaN(parseInt(e.target.value))) return onNewNumber(0)
          onNewNumber(parseInt(e.target.value))
        }}
      />

      <button
        className="btn btn-square ml-4"
        disabled={numberOfDice <= 1}
        onClick={() => {
          if (numberOfDice <= 1) return
          onNewNumber(numberOfDice - 1)
        }}
      >
        <MinusIcon />
      </button>
      <button
        className="btn btn-square ml-2"
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
