'use client'

import { Navbar } from '@/app/Navbar'
import { useState } from 'react'
import { DiceSelectWheel } from '../shadowrun/DiceSelectWheel'
import { D6, D6ResultDisplay, D6RollResult } from './D6ResultDisplay'
import { ExtractProperty } from 'utils/extractProperty'
import { DictionaryType } from 'dictionaries/dictionanier'
import { diceRollVibration } from 'utils/diceRollVibration'

type MultiD6RollerProps = {
  generalDict: ExtractProperty<DictionaryType, 'General'>
}

export const MultiD6Roller = ({ generalDict }: MultiD6RollerProps) => {
  const [numberOfDice, setNumberOfDice] = useState(1)
  const [rolls, setRolls] = useState<D6RollResult[]>([])

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
      id: Date.now(),
    }

    setRolls((rolls) => [...rolls, result])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Multi D6 🚧"></Navbar>
      <div className="alert alert-warning">
        <span>🚨 This Dice Roller is under active development! 🚨</span>
      </div>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <div className="h-full flex flex-col">
          <div className="flex-grow grid grid-cols-12 h-0 pb-4">
            <div
              id="d6Results"
              className={`overflow-y-auto col-span-10 no-scrollbar pr-2 flex flex-col`}
            >
              {[...rolls].reverse().map((roll, index) => (
                <D6ResultDisplay
                  isHighlighted={index === 0}
                  key={roll.id}
                  diceRoll={roll}
                  dict={generalDict}
                />
              ))}
            </div>
            <div className="col-span-2 relative">
              <DiceSelectWheel
                max={8}
                current={numberOfDice}
                onChange={setNumberOfDice}
              />
            </div>
          </div>
          <div className="flex-none border-t-2">
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
