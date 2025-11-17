'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useD6Store, D6RollResult, D6 } from '@/stores/d6-store'
import { DiceSelectWheel } from '../../shadowrun/components/dice-select-wheel'
import { D6ResultDisplay } from './d6-result-display'
import { Button } from '@/components/ui/button'
import { Trash2, Settings } from 'lucide-react'
import { diceRollVibration } from '@/utils/diceRollVibration'

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
                <D6ResultDisplay
                  isHighlighted={index === 0}
                  key={roll.id}
                  diceRoll={roll}
                />
              ))}
            </div>
            <div className="col-span-2 relative">
              <DiceSelectWheel
                max={config.maxDice}
                current={numberOfDice}
                onChange={setNumberOfDice}
              />
            </div>
          </div>
          <div className="flex-none border-t-2 pt-4">
            <div className="flex justify-end gap-2 mb-2">
              <Button variant="ghost" size="icon" onClick={() => clearRolls()}>
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="config">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
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
