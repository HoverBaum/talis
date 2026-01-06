'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useShadowrunStore } from './shadowrun-store'
import { DiceRollResult } from './DiceRollResult'
import { DiceSelectWheel } from '@/components/DiceSelectWheel'
import {
  RollerLayout,
  RollerLayoutResultArea,
  RollerLayoutControlArea,
  RollerLayoutFooter,
  RollerLayoutContent,
} from '@/components/RollerLayout'
import { RollerControls } from '@/components/RollerControls'
import { FreeDiceInput } from './FreeDiceInput'
import { QuickButton } from './QuickButton'
import { diceRollVibration } from '@/utils/diceRollVibration'
import { DiceRollType } from './shadowrun-store'
import { useAutoScroll } from '@/utils/use-auto-scroll'
import { nanoid } from 'nanoid'

export function ShadowrunRoller() {
  const t = useTranslations('Roller.Shadowrun')
  const rolls = useShadowrunStore((state) => state.rolls)
  const config = useShadowrunStore((state) => state.config)
  const numberOfDice = useShadowrunStore((state) => state.diceAmount)
  const setNumberOfDice = useShadowrunStore((state) => state.setDiceAmount)
  const clearRolls = useShadowrunStore((state) => state.clearRolls)
  const addRoll = useShadowrunStore((state) => state.addRoll)

  const rollD6 = useCallback(
    (dice: number) => {
      diceRollVibration(dice)
      const diceRolls: number[] = []
      for (let i = 0; i < dice; i++) {
        diceRolls.push(Math.floor(Math.random() * 6) + 1)
      }

      const hits = diceRolls.reduce(
        (hits, roll) => (roll >= 5 ? hits + 1 : hits),
        0
      )

      const isGlitch = diceRolls.filter((roll) => roll === 1).length >= dice / 2
      const isCriticalGlitch = isGlitch && hits === 0

      const result: DiceRollType = {
        results: diceRolls,
        type: 'Shadowrun',
        timestamp: Date.now(),
        id: nanoid(),
        shadowrun: { hits, isGlitch, isCriticalGlitch },
      }
      addRoll(result)
    },
    [rolls.length, addRoll]
  )

  useAutoScroll('d6Results', config.showNewResultBottom, [
    rolls,
    config.showNewResultBottom,
  ])

  return (
    <RollerLayout>
      <RollerLayoutContent>
        <div className="flex-grow grid grid-cols-12 h-0 pb-4">
          <RollerLayoutResultArea
            id="d6Results"
            showNewResultBottom={config.showNewResultBottom}
            className="col-span-10"
          >
            {[...rolls].reverse().map((roll, index) => (
              <DiceRollResult
                diceRoll={roll}
                isFaded={index > 1}
                isHighlighted={index === 0}
                key={roll.timestamp}
              />
            ))}
          </RollerLayoutResultArea>
          <RollerLayoutControlArea className="col-span-2">
            <DiceSelectWheel
              max={config.maxDiceAmount}
              current={numberOfDice}
              onChange={setNumberOfDice}
            />
          </RollerLayoutControlArea>
        </div>
      </RollerLayoutContent>
      <RollerLayoutFooter>
        <RollerControls
          onClear={clearRolls}
          onRoll={() => rollD6(numberOfDice)}
          rollDisabled={numberOfDice <= 0}
          rollLabel={t('roll')}
          settingsHref="shadowrun/config"
        >
          {config.useFreeInput && (
            <FreeDiceInput
              numberOfDice={numberOfDice}
              onNewNumber={setNumberOfDice}
              maxDiceAmount={config.maxDiceAmount}
            />
          )}

          {config.useFreeInput && config.useQuickButtons && (
            <div className="h-8 w-px bg-border" />
          )}

          {config.useQuickButtons && (
            <div className="overflow-x-auto flex">
              {config.quickButtons.map((quickButton) => (
                <QuickButton
                  quickButton={quickButton}
                  key={quickButton.id}
                  onClick={() => {
                    if (quickButton.type === 'instantRoll') {
                      rollD6(quickButton.amount)
                    } else {
                      setNumberOfDice(quickButton.amount)
                    }
                  }}
                />
              ))}
            </div>
          )}
        </RollerControls>
      </RollerLayoutFooter>
    </RollerLayout>
  )
}

