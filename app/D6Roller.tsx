'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const resultContainer = document.getElementById('d6Results')
    if (resultContainer) {
      resultContainer.scrollTop = resultContainer.scrollHeight
    }
  }, [results])

  return (
    <div className="h-full flex flex-col">
      <div id="d6Results" className="flex-grow grid grid-cols-12 h-0 p-4">
        <div className="overflow-y-auto col-span-10 no-scrollbar">
          {results.map((roll, index) => (
            <DiceRollResult
              diceRoll={roll}
              isFaded={index < results.length - 2}
              key={roll.timestamp}
            />
          ))}
        </div>
        <div className="col-span-2">hi</div>
      </div>
      <div className="p-4 flex-none border-t-2">
        <div className="flex">
          <p>
            Number of dice:{' '}
            <input
              type="text"
              placeholder="0"
              className="input input-bordered w-14 text-center"
              value={numberOfDice > 0 ? numberOfDice : ''}
              onChange={(e) => {
                if (isNaN(parseInt(e.target.value))) return setNumberOfDice(0)
                setNumberOfDice(parseInt(e.target.value))
              }}
            />
          </p>

          <button
            className="btn btn-square ml-2"
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

          <button
            className="btn btn-square ml-2"
            onClick={() => setResults([])}
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>

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
