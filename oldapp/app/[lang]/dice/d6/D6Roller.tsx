'use client'

import { Navbar } from '@/components/Navbar'
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
    <div className="min-h-screen flex flex-col">
      <Navbar title="D6 roller">
        <button
          className="btn btn-square btn-ghost ml-2"
          onClick={() => dispatch(clearRolls())}
        >
          <TrashIcon />
        </button>
        <Link href="d6/config">
          <button className="btn btn-square btn-ghost">
            <CogIcon />
          </button>
        </Link>
      </Navbar>

      <main className="flex-grow basis-0 p-2 md:p-4">
        <div className="h-full flex flex-col">
          <div className="flex-grow grid grid-cols-12 h-0 pb-4">
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
          <div className="flex-none border-t-2 pt-4">
            <button
              disabled={numberOfDice <= 0}
              className="btn btn-block btn-primary my-2 max-w-[90%] md:max-w-full mx-auto block"
              onClick={() => rollD6(numberOfDice)}
            >
              {generalDict.roll}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
