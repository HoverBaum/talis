'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useShadowrunStore } from '@/stores/shadowrun-store'
import { DiceRollResult } from './dice-roll-result'
import { DiceSelectWheel } from './dice-select-wheel'
import { FreeDiceInput } from './free-dice-input'
import { QuickButton } from './quick-button'
import { Button } from '@/components/ui/button'
import { Trash2, Settings } from 'lucide-react'
import { diceRollVibration } from '@/utils/diceRollVibration'
import { DiceRollType } from '@/stores/shadowrun-store'

export function ShadowrunRoller() {
  const t = useTranslations('Roller.Shadowrun')
  const rolls = useShadowrunStore((state) => state.rolls)
  const config = useShadowrunStore((state) => state.config)
  const numberOfDice = useShadowrunStore((state) => state.diceAmount)
  const setNumberOfDice = useShadowrunStore((state) => state.setDiceAmount)
  const clearRolls = useShadowrunStore((state) => state.clearRolls)
  const addRoll = useShadowrunStore((state) => state.addRoll)

  const rollD6 = (dice: number) => {
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
      id: rolls.length + 1,
      shadowrun: { hits, isGlitch, isCriticalGlitch },
    }
    addRoll(result)
  }

  useEffect(() => {
    const resultContainer = document.getElementById('d6Results')
    if (resultContainer) {
      if (config.showNewResultBottom) {
        resultContainer.scrollTo({
          top: resultContainer.scrollHeight,
          behavior: 'smooth',
        })
      } else {
        resultContainer.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }
    }
  }, [rolls, config.showNewResultBottom])

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-grow basis-0 p-2 md:p-4">
        <div className="h-full flex flex-col">
          <div className="flex-grow grid grid-cols-12 h-0 pb-4">
            <div
              id="d6Results"
              className={`overflow-y-auto col-span-10 scrollbar-none pr-2 flex ${
                config.showNewResultBottom ? 'flex-col-reverse' : 'flex-col'
              }`}
            >
              {[...rolls].reverse().map((roll, index) => (
                <DiceRollResult
                  diceRoll={roll}
                  isFaded={index > 1}
                  isHighlighted={index === 0}
                  key={roll.timestamp}
                />
              ))}
            </div>
            <div className="col-span-2 relative">
              <DiceSelectWheel
                max={config.maxDiceAmount}
                current={numberOfDice}
                onChange={setNumberOfDice}
              />
            </div>
          </div>
          <div className="flex-none border-t-2">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-4">
                {config.useFreeInput && (
                  <FreeDiceInput
                    numberOfDice={numberOfDice}
                    onNewNumber={setNumberOfDice}
                    maxDiceAmount={config.maxDiceAmount}
                  />
                )}

                {config.useFreeInput && config.useQuickButtons && (
                  <div className="h-8 w-[1px] bg-border" />
                )}

                {config.useQuickButtons && (
                  <div className="overflow-x-auto flex py-2">
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
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearRolls()}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="config">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Button
              disabled={numberOfDice <= 0}
              className="w-full my-2"
              onClick={() => rollD6(numberOfDice)}
            >
              {t('roll')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
