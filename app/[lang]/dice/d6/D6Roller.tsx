'use client'

import { Navbar } from '@/app/Navbar'
import { useState } from 'react'
import { DiceRollType } from '../shadowrun/DiceRollResult'
import { DiceSelectWheel } from '../shadowrun/DiceSelectWheel'

type D6RollerProps = {
  dict: any
}

export const D6Roller = ({ dict }: D6RollerProps) => {
  const [numberOfDice, setNumberOfDice] = useState(1)
  const [rolls, setRolls] = useState<number[][]>([])

  const rollD6 = (diceAmount: number) => {
    const diceRolls: number[] = []
    for (let i = 0; i < diceAmount; i++) {
      diceRolls.push(Math.floor(Math.random() * 6) + 1)
    }

    setRolls((rolls) => [...rolls, diceRolls])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="D6"></Navbar>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <div className="h-full flex flex-col">
          <div className="flex-grow grid grid-cols-12 h-0 pb-4">
            <div
              id="d6Results"
              className={`overflow-y-auto col-span-10 no-scrollbar pr-2 flex flex-col`}
            >
              {[...rolls].reverse().map((roll, index) => (
                <p key={index}>{roll.join(', ').replace(/,\s$/, '')}</p>
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
              {dict.roll}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
