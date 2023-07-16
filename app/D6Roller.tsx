'use client'

import { useState } from 'react'

export const D6Roller = () => {
  const [results, setResults] = useState<number[][]>([])
  const [numberOfDice, setNumberOfDice] = useState<number>(6)

  const rollD6 = (dice: number) => {
    console.log(`Rolling ${dice} dice.`)
    // Roll dice n times and save in results.
    const rolls: number[] = []
    for (let i = 0; i < dice; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1)
    }
    setResults((results) => [...results, rolls])
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-y-auto h-0 p-4">
        {[...results].reverse().map((rolls, i) => {
          return (
            <div key={i} className="font-mono">
              {rolls.map((roll, j) => {
                return (
                  <span key={j}>
                    {roll}
                    {j < rolls.length - 1 ? ', ' : ''}
                  </span>
                )
              })}
            </div>
          )
        })}
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
