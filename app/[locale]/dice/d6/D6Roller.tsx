'use client'

import { useTranslations } from 'next-intl'
import { useD6Store, D6RollResult, D6 } from './d6-store'
import { DiceSelectWheel } from '@/components/DiceSelectWheel'
import {
  RollerLayout,
  RollerLayoutResultArea,
  RollerLayoutControlArea,
  RollerLayoutFooter,
  RollerLayoutContent,
} from '@/components/RollerLayout'
import { RollerControls } from '@/components/RollerControls'
import { D6ResultDisplay } from './D6ResultDisplay'
import { diceRollVibration } from '@/utils/diceRollVibration'
import { useAutoScroll } from '@/utils/use-auto-scroll'
import { useHasHydrated } from '@/hooks/useStoreHydration'
import { nanoid } from 'nanoid'
import { rollManyDice } from '@/utils/dice-utils'
import { sanitizeIntegerInRange } from '@/utils/number-utils'

const isD6 = (value: number): value is D6 => {
  return value >= 1 && value <= 6
}

export function D6Roller() {
  const t = useTranslations('General')
  const hasHydrated = useHasHydrated(useD6Store)
  const rolls = useD6Store((state) => state.rolls)
  const config = useD6Store((state) => state.config)
  const numberOfDice = useD6Store((state) => state.diceAmount)
  const setNumberOfDice = useD6Store((state) => state.setDiceAmount)
  const clearRolls = useD6Store((state) => state.clearRolls)
  const addRoll = useD6Store((state) => state.addRoll)
  const safeMaxDice = sanitizeIntegerInRange(config.maxDice, {
    min: 1,
    max: 999,
    fallback: 8,
  })
  const safeDiceAmount = sanitizeIntegerInRange(numberOfDice, {
    min: 1,
    max: safeMaxDice,
    fallback: 1,
  })

  const rollD6 = (diceAmount: number) => {
    diceRollVibration(diceAmount)
    const diceRolls = rollManyDice(6, diceAmount).filter(isD6)
    const result: D6RollResult = {
      results: diceRolls,
      type: 'D6',
      timestamp: Date.now(),
      id: nanoid(),
    }

    addRoll(result)
  }

  useAutoScroll('d6Results', config.showNewResultBottom, [
    rolls,
    config.showNewResultBottom,
  ])

  return (
    <RollerLayout>
      <RollerLayoutContent>
        <RollerLayoutResultArea
          id="d6Results"
          showNewResultBottom={config.showNewResultBottom}
          className="col-span-10"
        >
          {[...rolls].reverse().map((roll, index) => (
            <D6ResultDisplay
              isHighlighted={index === 0}
              key={roll.id}
              diceRoll={roll}
            />
          ))}
        </RollerLayoutResultArea>
        <RollerLayoutControlArea className="col-span-2">
          {/* Wait for hydration before rendering config-dependent maxDice */}
          {hasHydrated && (
            <DiceSelectWheel
              max={safeMaxDice}
              current={safeDiceAmount}
              onChange={setNumberOfDice}
            />
          )}
        </RollerLayoutControlArea>
      </RollerLayoutContent>
      <RollerLayoutFooter>
        <RollerControls
          onClear={clearRolls}
          onRoll={() => rollD6(safeDiceAmount)}
          rollDisabled={safeDiceAmount <= 0}
          rollLabel={t('roll')}
          settingsHref="d6/config"
        />
      </RollerLayoutFooter>
    </RollerLayout>
  )
}
