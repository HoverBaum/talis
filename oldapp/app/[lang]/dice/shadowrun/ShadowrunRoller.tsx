'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DiceRollResult, DiceRollType } from './DiceRollResult'
import { DiceSelectWheel } from './DiceSelectWheel'
import { useConfig } from './useConfig'
import { FreeDiceInput } from './FreeDiceInput'
import Link from 'next/link'
import { RootState } from '@/app/store'
import { addRoll, clearRolls, setDiceAmount } from './shadowrun.slice'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { CogIcon } from '@/components/icons/CogIcon'
import { QuickButton } from './QuickButton'
import { DictionaryType } from 'dictionaries/dictionanier'
import { ExtractProperty } from 'utils/extractProperty'
import { diceRollVibration } from 'utils/diceRollVibration'
import { Button } from '@/components/ui/button'
import { useHeader } from '@/components/header-context'
import { RollerLayout } from '@/components/RollerLayout'

type ShadowrunDict = ExtractProperty<DictionaryType, 'Roller.Shadowrun'>

type ShadowrunRollerProps = {
  dict: ShadowrunDict
}

export const ShadowrunRoller = ({ dict }: ShadowrunRollerProps) => {
  const rolls = useSelector((state: RootState) => state.shadowrun.rolls)
  const {
    config: {
      showNewResultBottom,
      useFreeInput,
      maxDiceAmount,
      useQuickButtons,
      quickButtons,
    },
  } = useConfig()

  const numberOfDice = useSelector(
    (state: RootState) => state.shadowrun.diceAmount
  )
  const dispatch = useDispatch()
  const { setTitle, setActions } = useHeader()

  // Set header title and actions
  useEffect(() => {
    setTitle('Shadowrun')
    setActions(
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(clearRolls())}
        >
          <TrashIcon />
        </Button>
        <Link href="shadowrun/config">
          <Button variant="ghost" size="icon">
            <CogIcon />
          </Button>
        </Link>
      </>
    )
    return () => {
      setTitle('Talis')
      setActions(null)
    }
  }, [setTitle, setActions, dispatch])

  const setNumberOfDice = (dice: number) => {
    dispatch(setDiceAmount(dice))
  }

  const rollD6 = (dice: number) => {
    diceRollVibration(dice)
    // Roll dice n times and save in results.
    const diceRolls: number[] = []
    for (let i = 0; i < dice; i++) {
      diceRolls.push(Math.floor(Math.random() * 6) + 1)
    }

    // Everything 5 and higher is a hit.
    const hits = diceRolls.reduce(
      (hits, roll) => (roll >= 5 ? hits + 1 : hits),
      0
    )

    // If half or more are 1s, it's a glitch.
    const isGlitch = diceRolls.filter((roll) => roll === 1).length >= dice / 2

    // If player glitched without any hits, it's a critical glitch.
    const isCriticalGlitch = isGlitch && hits === 0

    const result: DiceRollType = {
      results: diceRolls,
      type: 'Shadowrun',
      timestamp: Date.now(),
      id: rolls.length + 1,
      shadowrun: { hits, isGlitch, isCriticalGlitch },
    }
    dispatch(addRoll(result))
    // setResults((results) => [result, ...results])
  }

  // Scroll down on new result to have it in view.
  useEffect(() => {
    const resultContainer = document.getElementById('d6Results')
    if (resultContainer) {
      if (showNewResultBottom) {
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
  }, [rolls])

  return (
    <div className="h-full">
      <RollerLayout
        resultsArea={
          <div className="h-full grid grid-cols-12 gap-2 p-2 md:p-4">
            <div
              id="d6Results"
              className={`overflow-y-auto col-span-10 no-scrollbar pr-2 flex ${
                showNewResultBottom ? 'flex-col-reverse' : 'flex-col'
              }`}
            >
              {[...rolls].reverse().map((roll, index) => (
                <DiceRollResult
                  diceRoll={roll}
                  isFaded={index > 1}
                  isHighlighted={index === 0}
                  key={roll.timestamp}
                  dict={dict.DiceRollResult}
                />
              ))}
            </div>
            <div className="col-span-2 relative">
              <DiceSelectWheel
                max={maxDiceAmount}
                current={numberOfDice}
                onChange={setNumberOfDice}
              />
            </div>
          </div>
        }
        controlsArea={
          <div className="flex px-2 md:px-4">
            {useFreeInput && (
              <div className="py-2">
                <FreeDiceInput
                  numberOfDice={numberOfDice}
                  onNewNumber={setNumberOfDice}
                  maxDiceAmount={maxDiceAmount}
                />
              </div>
            )}

            {useFreeInput && useQuickButtons && (
              <div className="mr-4 ml-6 w-[1px] border-r-2" />
            )}

            {useQuickButtons && (
              <div className="overflow-x-auto flex py-2">
                {quickButtons.map((quickButton) => (
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
        }
        buttonArea={
          <div className="px-2 md:px-4">
            <Button
              disabled={numberOfDice <= 0}
              className="w-full my-2 max-w-[90%] md:max-w-full mx-auto"
              onClick={() => rollD6(numberOfDice)}
            >
              {dict.roll}
            </Button>
          </div>
        }
      />
    </div>
  )
}
