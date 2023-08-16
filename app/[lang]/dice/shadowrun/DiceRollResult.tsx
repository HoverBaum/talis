import { useConfig } from './useConfig'

export type DiceRollType = {
  results: number[]
  type: 'Shadowrun'
  timestamp: number
  id: number
  shadowrun?: {
    hits: number
    isGlitch: boolean
    isCriticalGlitch: boolean
  }
}

const d6Mapping = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
}

type DiceRollResultProps = {
  diceRoll: DiceRollType
  isFaded?: boolean
  isHighlighted?: boolean
}

export const DiceRollResult = ({
  diceRoll,
  isFaded,
  isHighlighted,
}: DiceRollResultProps) => {
  const {
    config: { sortDice },
  } = useConfig()

  return (
    <div
      className={`animate-fadeIn p-2 mb-6 ${isFaded && 'opacity-75'} ${
        isHighlighted && 'bg-base-200 border-2'
      }`}
    >
      <span className={`text-xl ${isHighlighted && 'text-3xl'}`}>
        {diceRoll.shadowrun?.hits} hit
        {diceRoll.shadowrun?.hits === 1 ? '' : 's'}
      </span>
      {diceRoll.shadowrun?.isGlitch && (
        <span className="badge badge-warning mx-2">Glitch</span>
      )}
      {diceRoll.shadowrun?.isCriticalGlitch && (
        <span className="badge badge-error mx-2">Critical Glitch</span>
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
              <span
                key={j}
                className={`mr-1 ${result >= 5 && 'text-info'} ${
                  result === 1 &&
                  !diceRoll.shadowrun?.isCriticalGlitch &&
                  'text-warning'
                } ${
                  result === 1 &&
                  diceRoll.shadowrun?.isCriticalGlitch &&
                  'text-error'
                } ${result > 1 && result < 5 && 'text-gray-600'}`}
              >
                {d6Mapping[result as 1 | 2 | 3 | 4 | 5 | 6]}
              </span>
            )
          })}
      </span>

      <span className="block text-xs">
        #{diceRoll.id} - {new Date(diceRoll.timestamp).toLocaleTimeString()} -{' '}
        {diceRoll.results.length} dice
      </span>
    </div>
  )
}