'use client'

import { useState } from 'react'
import { DiceRollResult } from './DiceRollResult'

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

export const D6Roller = () => {
  const [results, setResults] = useState<DiceRollType[]>([])
  const [numberOfDice, setNumberOfDice] = useState<number>(6)

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
    setResults((results) => [...results, result])
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto h-0 p-4">
        {[...results].reverse().map((roll) => (
          <DiceRollResult diceRoll={roll} key={roll.timestamp} />
        ))}
      </div>
      <div className="p-4 flex-none border-t-2">
        <p>
          Number of dice:{' '}
          <input
            type="text"
            placeholder="Number of dice"
            className="input input-ghost"
            value={numberOfDice > 0 ? numberOfDice : ''}
            onChange={(e) => {
              if (isNaN(parseInt(e.target.value))) return setNumberOfDice(0)
              setNumberOfDice(parseInt(e.target.value))
            }}
          />
          <button
            className="btn btn-square"
            disabled={numberOfDice <= 1}
            onClick={() =>
              setNumberOfDice((dice) => {
                if (dice <= 1) {
                  return dice
                } else {
                  return dice - 1
                }
              })
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </button>
          <button
            className="btn btn-square ml-2"
            onClick={() => setNumberOfDice((dice) => dice + 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </p>

        <button
          disabled={numberOfDice <= 0}
          autoFocus={true}
          className="btn btn-neutral btn-block mt-4"
          onClick={() => rollD6(numberOfDice)}
        >
          Roll
        </button>
      </div>
    </div>
  )
}
