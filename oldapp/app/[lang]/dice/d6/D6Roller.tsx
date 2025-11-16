'use client'

import { DiceSelectWheel } from '../shadowrun/DiceSelectWheel'
import { D6, D6ResultDisplay, D6RollResult } from './D6ResultDisplay'
import { ExtractProperty } from 'utils/extractProperty'
import { DictionaryType } from 'dictionaries/dictionanier'
import { diceRollVibration } from 'utils/diceRollVibration'
import { TrashIcon } from '@/components/icons/TrashIcon'
import Link from 'next/link'
import { CogIcon } from '@/components/icons/CogIcon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { addRoll, clearRolls, setDiceAmount } from './d6.slice'
import { useD6Config } from './config/useD6Config'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useHeader } from '@/components/header-context'
import { RollerLayout } from '@/components/RollerLayout'

type MultiD6RollerProps = {
  generalDict: ExtractProperty<DictionaryType, 'General'>
}

export const MultiD6Roller = ({ generalDict }: MultiD6RollerProps) => {
  const numberOfDice = useSelector((state: RootState) => state.d6.diceAmount)
  const maxNumberOfDice = useSelector(
    (state: RootState) => state.d6.config.maxDice
  )
  const rolls = useSelector((state: RootState) => state.d6.rolls)
  const { config } = useD6Config()
  const dispatch = useDispatch()
  const { setTitle, setActions } = useHeader()

  // Set header title and actions
  useEffect(() => {
    setTitle('D6 Roller')
    setActions(
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(clearRolls())}
        >
          <TrashIcon />
        </Button>
        <Link href="d6/config">
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

  const setNumberOfDice = (amount: number) => {
    dispatch(setDiceAmount(amount))
  }

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

    dispatch(addRoll(result))
  }

  // Scroll on new result to keep everything in view.
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
  }, [rolls])

  return (
    <div className="h-full">
      <RollerLayout
        resultsArea={
          <div className="h-full grid grid-cols-12 gap-2 p-2 md:p-4">
            <div
              id="d6Results"
              className={`overflow-y-auto col-span-10 no-scrollbar pr-2 flex ${
                config.showNewResultBottom ? 'flex-col-reverse' : 'flex-col'
              }`}
            >
              {[...rolls].reverse().map((roll, index) => (
                <D6ResultDisplay
                  isHighlighted={index === 0}
                  key={roll.id}
                  diceRoll={roll}
                  dict={generalDict}
                  sortDice={config.sortDice}
                  sumDice={config.sumDice}
                />
              ))}
            </div>
            <div className="col-span-2 relative">
              <DiceSelectWheel
                max={maxNumberOfDice}
                current={numberOfDice}
                onChange={setNumberOfDice}
              />
            </div>
          </div>
        }
        buttonArea={
          <div className="px-2 md:px-4">
            <Button
              disabled={numberOfDice <= 0}
              className="w-full my-2 max-w-[90%] md:max-w-full mx-auto"
              onClick={() => rollD6(numberOfDice)}
            >
              {generalDict.roll}
            </Button>
          </div>
        }
      />
    </div>
  )
}
