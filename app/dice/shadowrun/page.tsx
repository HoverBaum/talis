'use client'

import { Navbar } from '@/app/Navbar'
import { useEffect, useState } from 'react'
import { DiceRollResult } from './DiceRollResult'
import { DiceSelectWheel } from './DiceSelectWheel'
import { useConfig } from './useConfig'
import { FreeDiceInput } from './FreeDiceInput'

export type DiceRollType = {
  results: number[]
  type: 'Shadowrun'
  timestamp: number
  id: number
  shadowrun?: {
    hits: number
    isGlitch: boolean
    isCriticalGlitch: boolean
  }
}

const MAX_DICE_AMOUNT = 50
const DEFAULT_DICE_AMOUNT = 7

export default function Home() {
  const [results, setResults] = useState<DiceRollType[]>([])
  const [numberOfDice, setNumberOfDice] = useState<number>(DEFAULT_DICE_AMOUNT)
  const {
    config: { showNewResultBottom, useFreeInput },
  } = useConfig()

  const rollD6 = (dice: number) => {
    console.log(`Rolling ${dice} dice.`)
    // Roll dice n times and save in results.
    const rolls: number[] = []
    for (let i = 0; i < dice; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1)
    }

    // Everything 5 and higher is a hit.
    const hits = rolls.reduce((hits, roll) => (roll >= 5 ? hits + 1 : hits), 0)

    // If half or more are 1s, it's a glitch.
    const isGlitch = rolls.filter((roll) => roll === 1).length >= dice / 2

    // If player glitched without any hits, it's a critical glitch.
    const isCriticalGlitch = isGlitch && hits === 0

    const result: DiceRollType = {
      results: rolls,
      type: 'Shadowrun',
      timestamp: Date.now(),
      id: results.length + 1,
      shadowrun: { hits, isGlitch, isCriticalGlitch },
    }
    setResults((results) => [result, ...results])
  }

  // Scroll down on new result to have it in view.
  useEffect(() => {
    if (!showNewResultBottom) return
    console.log('Scrolling down')
    const resultContainer = document.getElementById('d6Results')
    if (resultContainer) {
      resultContainer.scrollTop = resultContainer.scrollHeight
    }
  }, [results])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Shadowrun" />
      <main className="flex-grow basis-0 p-2 md:p-4">
        <div className="h-full flex flex-col">
          <div className="flex-grow grid grid-cols-12 h-0 pb-4">
            <div
              id="d6Results"
              className={`overflow-y-auto col-span-10 no-scrollbar flex ${
                showNewResultBottom ? 'flex-col-reverse' : 'flex-col'
              }`}
            >
              {results.map((roll, index) => (
                <DiceRollResult
                  diceRoll={roll}
                  isFaded={index > 1}
                  key={roll.timestamp}
                />
              ))}
            </div>
            <div className="col-span-2 relative">
              <DiceSelectWheel
                max={MAX_DICE_AMOUNT}
                current={numberOfDice}
                onChange={(amount) => setNumberOfDice(amount)}
              />
            </div>
          </div>
          <div className="flex-none border-t-2 pt-4">
            {useFreeInput && (
              <FreeDiceInput
                numberOfDice={numberOfDice}
                onNewNumber={setNumberOfDice}
                onClearResults={() => setResults([])}
                maxDiceAmount={MAX_DICE_AMOUNT}
              />
            )}

            <button
              disabled={numberOfDice <= 0}
              className="btn btn-block mt-4"
              onClick={() => rollD6(numberOfDice)}
            >
              Roll
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
