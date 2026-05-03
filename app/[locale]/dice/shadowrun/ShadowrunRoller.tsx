'use client'

/**
 * Main Shadowrun roller that supports standard tests and Edge-style rolls.
 *
 * Features:
 * - Roll history with Shadowrun-specific metadata (hits, glitches, thresholds, limits)
 * - Roll mode toggle (standard vs edge) for different test behaviors
 * - Optional free input and configurable quick buttons
 * - Config-driven dice wheel bounds and result ordering
 *
 * Assumptions:
 * - Dice pool size is clamped by the store to a safe persisted range
 * - Edge mode uses exploding sixes and ignores configured hit limits
 * - Glitch calculation is based on the original pool size of the test
 */
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
import { DiceRollType, ShadowrunRollMode } from './shadowrun-store'
import { useAutoScroll } from '@/utils/use-auto-scroll'
import { useHasHydrated } from '@/hooks/useStoreHydration'
import { Button } from '@/components/ui/button'
import { nanoid } from 'nanoid'

const rollShadowrunPool = (dice: number, useRuleOfSix: boolean) => {
  const results: number[] = []
  let diceToRoll = dice
  let extraDiceFromExplosions = 0

  while (diceToRoll > 0) {
    const roll = Math.floor(Math.random() * 6) + 1
    results.push(roll)
    diceToRoll -= 1

    if (useRuleOfSix && roll === 6) {
      diceToRoll += 1
      extraDiceFromExplosions += 1
    }
  }

  return { results, extraDiceFromExplosions }
}

export function ShadowrunRoller() {
  const t = useTranslations('Roller.Shadowrun')
  const hasHydrated = useHasHydrated(useShadowrunStore)
  const rolls = useShadowrunStore((state) => state.rolls)
  const config = useShadowrunStore((state) => state.config)
  const rollMode = useShadowrunStore((state) => state.rollMode)
  const setRollMode = useShadowrunStore((state) => state.setRollMode)
  const numberOfDice = useShadowrunStore((state) => state.diceAmount)
  const setNumberOfDice = useShadowrunStore((state) => state.setDiceAmount)
  const clearRolls = useShadowrunStore((state) => state.clearRolls)
  const addRoll = useShadowrunStore((state) => state.addRoll)

  const rollD6 = (dice: number, mode: ShadowrunRollMode) => {
    if (dice <= 0) return

    diceRollVibration(dice)
    const shouldExplode = mode === 'edge' || config.useRuleOfSix
    const { results, extraDiceFromExplosions } = rollShadowrunPool(
      dice,
      shouldExplode
    )

    const rawHits = results.reduce((hits, roll) => (roll >= 5 ? hits + 1 : hits), 0)
    const ones = results.filter((roll) => roll === 1).length
    const isGlitch = ones >= Math.ceil(dice / 2)
    const isCriticalGlitch = isGlitch && rawHits === 0
    const shouldApplyLimit = config.useHitLimit && mode !== 'edge'
    const hits = shouldApplyLimit ? Math.min(rawHits, config.hitLimit) : rawHits
    const threshold = config.useThreshold ? config.threshold : undefined

    const result: DiceRollType = {
      results,
      type: 'Shadowrun',
      timestamp: Date.now(),
      id: nanoid(),
      shadowrun: {
        hits,
        rawHits,
        ones,
        isGlitch,
        isCriticalGlitch,
        appliedLimit: shouldApplyLimit ? config.hitLimit : null,
        threshold,
        thresholdMet:
          typeof threshold === 'number' ? hits >= threshold : undefined,
        extraDiceFromExplosions,
      },
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
            <DiceRollResult
              diceRoll={roll}
              isFaded={index > 1}
              isHighlighted={index === 0}
              key={roll.id}
            />
          ))}
        </RollerLayoutResultArea>
        <RollerLayoutControlArea className="col-span-2">
          {/* Wait for hydration before rendering config-dependent maxDiceAmount */}
          {hasHydrated && (
            <DiceSelectWheel
              max={config.maxDiceAmount}
              current={numberOfDice}
              onChange={setNumberOfDice}
            />
          )}
        </RollerLayoutControlArea>
      </RollerLayoutContent>
      <RollerLayoutFooter>
        <RollerControls
          onClear={clearRolls}
          onRoll={() => rollD6(numberOfDice, rollMode)}
          rollDisabled={numberOfDice <= 0}
          rollLabel={t('roll')}
          settingsHref="shadowrun/config"
        >
          {/* Wait for hydration before rendering config-dependent UI */}
          {hasHydrated && (
            <>
              <div className="flex gap-2">
                <Button
                  variant={rollMode === 'standard' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRollMode('standard')}
                  className={rollMode === 'standard' ? 'border border-transparent' : ''}
                >
                  {t('standardMode')}
                </Button>
                <Button
                  variant={rollMode === 'edge' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setRollMode('edge')}
                  className={rollMode === 'edge' ? 'border border-transparent' : ''}
                >
                  {t('edgeMode')}
                </Button>
              </div>

              {(config.useFreeInput || config.useQuickButtons) && (
                <div className="h-8 w-px bg-border" />
              )}

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
                <div className="flex">
                  {config.quickButtons.map((quickButton) => (
                    <QuickButton
                      quickButton={quickButton}
                      key={quickButton.id}
                      onClick={() => {
                        if (quickButton.type === 'instantRoll') {
                          rollD6(quickButton.amount, rollMode)
                        } else {
                          setNumberOfDice(quickButton.amount)
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </RollerControls>
      </RollerLayoutFooter>
    </RollerLayout>
  )
}
