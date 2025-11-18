'use client'

import { useTranslations } from 'next-intl'
import { useD6Store, D6RollResult, D6 } from '@/stores/d6-store'
import { DiceSelectWheel } from '@/components/DiceSelectWheel'
import { RollerLayout } from '@/components/RollerLayout'
import { RollerControls } from '@/components/RollerControls'
import { D6ResultDisplay } from './d6-result-display'
import { diceRollVibration } from '@/utils/diceRollVibration'
import { useAutoScroll } from '@/hooks/use-auto-scroll'

export function D6Roller() {
  const t = useTranslations('General')
  const rolls = useD6Store((state) => state.rolls)
  const config = useD6Store((state) => state.config)
  const numberOfDice = useD6Store((state) => state.diceAmount)
  const setNumberOfDice = useD6Store((state) => state.setDiceAmount)
  const clearRolls = useD6Store((state) => state.clearRolls)
  const addRoll = useD6Store((state) => state.addRoll)

  const rollD6 = (diceAmount: number) => {
    diceRollVibration(diceAmount)
    const diceRolls: D6[] = []
    for (let i = 0; i < diceAmount; i++) {
      diceRolls.push((Math.floor(Math.random() * 6) + 1) as D6)
    }
    const result: D6RollResult = {
      results: diceRolls,
      type: 'D6',
      timestamp: Date.now(),
      id: Date.now().toString() + (Math.random() * 100).toString().slice(0, 2),
    }

    addRoll(result)
  }

  useAutoScroll('d6Results', config.showNewResultBottom, [
    rolls,
    config.showNewResultBottom,
  ])

  return (
    <RollerLayout
      resultContainerId="d6Results"
      showNewResultBottom={config.showNewResultBottom}
      resultArea={[...rolls].reverse().map((roll, index) => (
        <D6ResultDisplay
          isHighlighted={index === 0}
          key={roll.id}
          diceRoll={roll}
        />
      ))}
      controlArea={
        <DiceSelectWheel
          max={config.maxDice}
          current={numberOfDice}
          onChange={setNumberOfDice}
        />
      }
      footer={
        <RollerControls
          onClear={clearRolls}
          onRoll={() => rollD6(numberOfDice)}
          rollDisabled={numberOfDice <= 0}
          rollLabel={t('roll')}
          settingsHref="config"
        />
      }
    />
  )
}

