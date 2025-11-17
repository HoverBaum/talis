'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import {
  useDaggerheartStore,
  DaggerheartRoll,
} from '@/stores/daggerheart-store'
import { DaggerheartResultDisplay } from './daggerheart-result-display'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { diceRollVibration } from '@/utils/diceRollVibration'

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

  useEffect(() => {
    const container = document.getElementById('d12Results')
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    }
  }, [rolls])

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-grow basis-0 p-2 md:p-4 flex flex-col">
        <div className="flex flex-col flex-grow h-full">
          <div
            id="d12Results"
            className="flex-grow overflow-y-auto scrollbar-none pr-2 flex flex-col-reverse h-0 pb-4"
          >
            {[...rolls].reverse().map((roll, index) => (
              <DaggerheartResultDisplay
                key={roll.id}
                roll={roll}
                isHighlighted={index === 0}
              />
            ))}
          </div>
          <div className="flex-none border-t-2 pt-4">
            <div className="flex justify-end gap-2 mb-2">
              <Button variant="ghost" size="icon" onClick={() => clearRolls()}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Button className="w-full my-2" onClick={rollDice}>
              {t('roll')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
