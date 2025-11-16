import { ExtractProperty } from 'utils/extractProperty'
import { useConfig } from './useConfig'
import { DictionaryType } from 'dictionaries/dictionanier'

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
  dict: ExtractProperty<DictionaryType, 'Roller.Shadowrun.DiceRollResult'>
}

export const DiceRollResult = ({
  diceRoll,
  isFaded,
  isHighlighted,
  dict,
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
      <span className={`${isHighlighted ? 'text-3xl' : 'text-xl'}`}>
        {diceRoll.shadowrun?.hits}{' '}
        {diceRoll.shadowrun?.hits === 1 ? dict.hit : dict.hits}
      </span>
      {diceRoll.shadowrun?.isGlitch && (
        <span className="badge badge-warning mx-2">{dict.glitch}</span>
      )}
      {diceRoll.shadowrun?.isCriticalGlitch && (
        <span className="badge badge-error mx-2">{dict.criticalGlitch}</span>
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
        {diceRoll.results.length} {dict.dice}
      </span>
    </div>
  )
}
