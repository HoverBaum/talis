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
    <div className="flex">
      <p>
        Number of dice:{' '}
        <input
          type="text"
          placeholder="0"
          className="input input-bordered w-14 text-center"
          value={numberOfDice > 0 ? numberOfDice : ''}
          onChange={(e) => {
            if (isNaN(parseInt(e.target.value))) return onNewNumber(0)
            onNewNumber(parseInt(e.target.value))
          }}
        />
      </p>

      <button
        className="btn btn-square ml-2"
        disabled={numberOfDice <= 1}
        onClick={() => {
          if (numberOfDice <= 1) return
          onNewNumber(numberOfDice - 1)
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
        </svg>
      </button>
      <button
        className="btn btn-square ml-2"
        disabled={numberOfDice >= maxDiceAmount}
        onClick={() => {
          if (numberOfDice >= maxDiceAmount) return
          onNewNumber(numberOfDice + 1)
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
    </div>
  )
}
