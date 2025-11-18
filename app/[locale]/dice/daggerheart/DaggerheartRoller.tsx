'use client'

import { useTranslations } from 'next-intl'
import {
  useDaggerheartStore,
  DaggerheartRoll,
} from '@/stores/daggerheart-store'
import {
  RollerLayout,
  RollerLayoutResultArea,
  RollerLayoutFooter,
  RollerLayoutContent,
} from '@/components/RollerLayout'
import { RollerControls } from '@/components/RollerControls'
import { DaggerheartResultDisplay } from './DaggerheartResultDisplay'
import { diceRollVibration } from '@/utils/diceRollVibration'
import { useAutoScroll } from '@/hooks/use-auto-scroll'

export function DaggerheartRoller() {
  const t = useTranslations('Roller.Daggerheart')
  const rolls = useDaggerheartStore((state) => state.rolls)
  const clearRolls = useDaggerheartStore((state) => state.clearRolls)
  const addRoll = useDaggerheartStore((state) => state.addRoll)

  const rollDice = () => {
    diceRollVibration(2)
    const hope = Math.floor(Math.random() * 12) + 1
    const fear = Math.floor(Math.random() * 12) + 1
    const roll: DaggerheartRoll = {
      hope,
      fear,
      timestamp: Date.now(),
      id: `${rolls.length + 1}`,
    }
    addRoll(roll)
  }

  useAutoScroll('d12Results', true, [rolls])

  return (
    <RollerLayout>
      <RollerLayoutContent>
        <RollerLayoutResultArea
          id="d12Results"
          showNewResultBottom={true}
          className="h-0 pb-2"
        >
          {[...rolls].reverse().map((roll, index) => (
            <DaggerheartResultDisplay
              key={roll.id}
              roll={roll}
              isHighlighted={index === 0}
            />
          ))}
        </RollerLayoutResultArea>
      </RollerLayoutContent>
      <RollerLayoutFooter>
        <RollerControls
          onClear={clearRolls}
          onRoll={rollDice}
          rollLabel={t('roll')}
        />
      </RollerLayoutFooter>
    </RollerLayout>
  )
}

