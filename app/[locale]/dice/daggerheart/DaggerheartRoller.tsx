'use client'

import { useTranslations } from 'next-intl'
import {
  useDaggerheartStore,
  DaggerheartRoll,
  type DaggerheartRollResult,
} from './daggerheart-store'
import { type PolyhedralDiceType, type PolyhedralRollResult } from '../polyhedral/polyhedral-store'
import {
  RollerLayout,
  RollerLayoutResultArea,
  RollerLayoutControlArea,
  RollerLayoutFooter,
  RollerLayoutContent,
} from '@/components/RollerLayout'
import { RollerControls } from '@/components/RollerControls'
import { DaggerheartResultDisplay } from './DaggerheartResultDisplay'
import { PolyhedralResultDisplay } from '@/components/PolyhedralResultDisplay'
import { DiceSelectWheel } from '@/components/DiceSelectWheel'
import { diceRollVibration } from '@/utils/diceRollVibration'
import { useAutoScroll } from '@/utils/use-auto-scroll'
import { Button } from '@/components/ui/button'

export function DaggerheartRoller() {
  const t = useTranslations('Roller.Daggerheart')
  const tGeneral = useTranslations('General')
  const rolls = useDaggerheartStore((state) => state.rolls)
  const config = useDaggerheartStore((state) => state.config)
  const rollMode = useDaggerheartStore((state) => state.rollMode)
  const setRollMode = useDaggerheartStore((state) => state.setRollMode)
  const selectedDiceType = useDaggerheartStore((state) => state.selectedDiceType)
  const setSelectedDiceType = useDaggerheartStore(
    (state) => state.setSelectedDiceType
  )
  const diceQuantities = useDaggerheartStore((state) => state.diceQuantities)
  const setDiceQuantity = useDaggerheartStore((state) => state.setDiceQuantity)
  const clearRolls = useDaggerheartStore((state) => state.clearRolls)
  const addRoll = useDaggerheartStore((state) => state.addRoll)

  // Type guard to check if a roll is a DaggerheartRoll
  const isDaggerheartRoll = (roll: DaggerheartRollResult): roll is DaggerheartRoll => {
    return roll.type === 'Daggerheart'
  }

  const maxQuantity =
    config.diceSettings?.[selectedDiceType]?.maxQuantity ?? 8
  const currentQuantity = diceQuantities[selectedDiceType] ?? 1

  const rollDice = () => {
    if (rollMode === 'daggerheart') {
      diceRollVibration(2)
      const hope = Math.floor(Math.random() * 12) + 1
      const fear = Math.floor(Math.random() * 12) + 1
      const roll: DaggerheartRoll = {
        hope,
        fear,
        timestamp: Date.now(),
        id: `${rolls.length + 1}`,
        type: 'Daggerheart',
      }
      addRoll(roll)
    } else {
      rollPolyhedralDice(selectedDiceType, currentQuantity)
    }
  }

  const rollPolyhedralDice = (diceType: PolyhedralDiceType, quantity: number) => {
    diceRollVibration(quantity)
    const diceRolls: number[] = []
    for (let i = 0; i < quantity; i++) {
      diceRolls.push(Math.floor(Math.random() * diceType) + 1)
    }
    const result: PolyhedralRollResult = {
      results: diceRolls,
      diceType,
      type: 'Polyhedral',
      timestamp: Date.now(),
      id:
        Date.now().toString() + (Math.random() * 100).toString().slice(0, 2),
    }

    addRoll(result)
  }

  const handleQuantityChange = (quantity: number) => {
    setDiceQuantity(selectedDiceType, quantity)
  }

  const handleDiceTypeSelect = (diceType: PolyhedralDiceType) => {
    setSelectedDiceType(diceType)
    setRollMode('polyhedral')
  }

  useAutoScroll('d12Results', true, [rolls])

  return (
    <RollerLayout>
      <RollerLayoutContent>
        <div className="flex-grow grid grid-cols-12 h-0 pb-4">
          <RollerLayoutResultArea
            id="d12Results"
            showNewResultBottom={true}
            className="col-span-10"
          >
            {[...rolls].reverse().map((roll, index) => {
              if (isDaggerheartRoll(roll)) {
                return (
                  <DaggerheartResultDisplay
                    key={roll.id}
                    roll={roll}
                    isHighlighted={index === 0}
                  />
                )
              } else {
                return (
                  <PolyhedralResultDisplay
                    key={roll.id}
                    diceRoll={roll}
                    isHighlighted={index === 0}
                  />
                )
              }
            })}
          </RollerLayoutResultArea>
          <RollerLayoutControlArea className="col-span-2">
            {rollMode === 'polyhedral' && (
              <DiceSelectWheel
                max={maxQuantity}
                current={currentQuantity}
                onChange={handleQuantityChange}
              />
            )}
          </RollerLayoutControlArea>
        </div>
      </RollerLayoutContent>
      <RollerLayoutFooter>
        <RollerControls
          onClear={clearRolls}
          onRoll={rollDice}
          rollDisabled={rollMode === 'polyhedral' && currentQuantity <= 0}
          rollLabel={tGeneral('roll')}
          settingsHref="daggerheart/config"
        >
          <div className="flex gap-2">
            <Button
              variant={rollMode === 'daggerheart' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRollMode('daggerheart')}
              className={rollMode === 'daggerheart' ? 'border border-transparent' : ''}
            >
              {t('roll')}
            </Button>
            {(config.enabledDice || []).map((diceType) => {
              const isSelected = rollMode === 'polyhedral' && selectedDiceType === diceType
              return (
                <Button
                  key={diceType}
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDiceTypeSelect(diceType as PolyhedralDiceType)}
                  className={isSelected ? 'border border-transparent' : ''}
                >
                  d{diceType}
                </Button>
              )
            })}
          </div>
        </RollerControls>
      </RollerLayoutFooter>
    </RollerLayout>
  )
}
