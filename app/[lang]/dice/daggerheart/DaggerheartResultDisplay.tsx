import { ExtractProperty } from 'utils/extractProperty'
import { DictionaryType } from 'dictionaries/dictionanier'
import { DaggerheartRoll } from './daggerheart.slice'

type DaggerheartDict = ExtractProperty<DictionaryType, 'Roller.Daggerheart'>

type Props = {
  roll: DaggerheartRoll
  isHighlighted?: boolean
  dict: DaggerheartDict
}

export const DaggerheartResultDisplay = ({
  roll,
  isHighlighted = false,
  dict,
}: Props) => {
  const isCritical = roll.hope === roll.fear

  let hopeGrow = 1
  let fearGrow = 1

  if (isCritical) {
    hopeGrow = 1
    fearGrow = 1
  } else if (roll.hope > roll.fear) {
    hopeGrow = 2
    fearGrow = 1
  } else if (roll.fear > roll.hope) {
    hopeGrow = 1
    fearGrow = 2
  }

  return (
    <div
      className={`animate-fadeIn p-2 mb-6 ${
        isHighlighted ? 'bg-base-200 border-2' : ''
      }`}
    >
      <div
        className={`flex text-center ${isHighlighted ? 'text-2xl' : 'text-md'}`}
      >
        <div
          className="flex flex-col items-center mx-1 rounded bg-blue-200 text-black p-2"
          style={{ flexGrow: hopeGrow }}
        >
          <span className="font-semibold">
            {dict.hope} {roll.hope}
          </span>
        </div>
        <div
          className="flex flex-col items-center mx-1 rounded bg-red-200 text-black p-2"
          style={{ flexGrow: fearGrow }}
        >
          <span className="font-semibold">
            {dict.fear} {roll.fear}
          </span>
        </div>
      </div>
      {isCritical && (
        <span className="badge badge-accent mt-2">{dict.criticalSuccess}</span>
      )}
      <span className="block text-xs mt-1">
        {new Date(roll.timestamp).toLocaleTimeString()}
      </span>
    </div>
  )
}
