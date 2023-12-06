import { DictionaryType } from 'dictionaries/dictionanier'
import { ExtractProperty } from 'utils/extractProperty'

export type D6 = 1 | 2 | 3 | 4 | 5 | 6

export type D6RollResult = {
  results: D6[]
  type: 'D6'
  timestamp: number
  id: string
}

type D6ResultDisplayProps = {
  diceRoll: D6RollResult
  isHighlighted?: boolean
  sortDice?: boolean
  sumDice?: boolean
  dict: ExtractProperty<DictionaryType, 'General'>
}

const d6Mapping = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
}

export const D6ResultDisplay = ({
  diceRoll,
  isHighlighted = false,
  sortDice = false,
  sumDice = false,
  dict,
}: D6ResultDisplayProps) => {
  return (
    <div
      className={`animate-fadeIn p-2 mb-4 ${
        isHighlighted && 'bg-base-200 border-2'
      }`}
    >
      {sumDice && (
        <span className={`${isHighlighted ? 'text-3xl' : 'text-xl'}`}>
          {diceRoll.results.reduce((acc, curr) => acc + curr, 0)}{' '}
        </span>
      )}
      <span
        className={`text-4xl flex flex-wrap ${isHighlighted && 'text-5xl'}`}
      >
        {[...diceRoll.results]
          .sort((a, b) => {
            if (sortDice) {
              // We want hits to be at the front.
              return b - a
            } else {
              return 0
            }
          })
          .map((result, j) => {
            return (
              <span key={j} className={`mr-1`}>
                {d6Mapping[result as 1 | 2 | 3 | 4 | 5 | 6]}
              </span>
            )
          })}
      </span>

      <span className="block text-xs">
        #{diceRoll.id} - {new Date(diceRoll.timestamp).toLocaleTimeString()} -{' '}
        {diceRoll.results.length} {dict.dice}
      </span>
    </div>
  )
}
