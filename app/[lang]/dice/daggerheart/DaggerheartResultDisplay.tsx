import { ExtractProperty } from 'utils/extractProperty'
import { DictionaryType } from 'dictionaries/dictionanier'
import { DaggerheartRoll } from './daggerheart.slice'

type DaggerheartDict = ExtractProperty<DictionaryType, 'Roller.Daggerheart'>

type Props = {
  roll: DaggerheartRoll
  isHighlighted?: boolean
  dict: DaggerheartDict
}

export const DaggerheartResultDisplay = ({ roll, isHighlighted = false, dict }: Props) => {
  const isCritical = roll.hope === roll.fear
  const hopeGrow = isCritical ? 1 : roll.hope
  const fearGrow = isCritical ? 1 : roll.fear

  return (
    <div className={`animate-fadeIn p-2 mb-6 ${isHighlighted && 'bg-base-200 border-2'}`}>\
      <div className={`flex text-center ${isHighlighted ? 'text-5xl' : 'text-3xl'}`}>\
        <div className="flex flex-col items-center mx-1" style={{flexGrow: hopeGrow}}>
          <span className="text-sm">{dict.hope}</span>
          <span>{roll.hope}</span>
        </div>
        <div className="flex flex-col items-center mx-1" style={{flexGrow: fearGrow}}>
          <span className="text-sm">{dict.fear}</span>
          <span>{roll.fear}</span>
        </div>
      </div>
      {isCritical && <span className="badge badge-accent mt-2">{dict.criticalSuccess}</span>}
      <span className="block text-xs">
        #{roll.id} - {new Date(roll.timestamp).toLocaleTimeString()}
      </span>
    </div>
  )
}
