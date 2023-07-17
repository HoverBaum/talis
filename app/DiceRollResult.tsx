import { DiceRollType } from './D6Roller'

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
}

export const DiceRollResult = ({ diceRoll, isFaded }: DiceRollResultProps) => {
  return (
    <div className={`pb-6 ${isFaded && 'opacity-75'}`}>
      {diceRoll.type === 'Shadowrun' && (
        <>
          <span>
            {diceRoll.shadowrun?.hits} hit
            {diceRoll.shadowrun?.hits === 1 ? '' : 's'}
          </span>
          {diceRoll.shadowrun?.isGlitch && (
            <span className="badge badge-warning mx-2">Glitch</span>
          )}
          {diceRoll.shadowrun?.isCriticalGlitch && (
            <span className="badge badge-error mx-2">Critical Glitch</span>
          )}
          <span className="text-4xl flex flex-wrap">
            {diceRoll.results.map((result, j) => {
              return (
                <span
                  key={j}
                  className={`${result >= 5 && 'text-info'} ${
                    result === 1 &&
                    !diceRoll.shadowrun?.isCriticalGlitch &&
                    'text-warning'
                  } ${
                    result === 1 &&
                    diceRoll.shadowrun?.isCriticalGlitch &&
                    'text-error'
                  }`}
                >
                  {d6Mapping[result as 1 | 2 | 3 | 4 | 5 | 6]}
                </span>
              )
            })}
          </span>
        </>
      )}
      {diceRoll.type !== 'Shadowrun' && (
        <span className="font-mono text-xl">
          {diceRoll.results.map((result, j) => {
            return (
              <span key={j}>
                {result}
                {j < diceRoll.results.length - 1 ? ', ' : ''}
              </span>
            )
          })}
        </span>
      )}
      <span className="block text-xs">
        #{diceRoll.id} - {new Date(diceRoll.timestamp).toLocaleDateString()} -{' '}
        {new Date(diceRoll.timestamp).toLocaleTimeString()}
      </span>
    </div>
  )
}
