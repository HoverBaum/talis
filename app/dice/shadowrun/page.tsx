'use client'

import { Navbar } from '@/app/Navbar'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DiceRollResult } from './DiceRollResult'
import { DiceSelectWheel } from './DiceSelectWheel'
import { useConfig } from './useConfig'
import { FreeDiceInput } from './FreeDiceInput'
import Link from 'next/link'
import { RootState } from '@/app/store'
import { addRoll, clearRolls, setDiceAmount } from './shadowrunSlice'

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

export default function Home() {
  const rolls = useSelector((state: RootState) => state.shadowrun.rolls)
  // const [results, setResults] = useState<DiceRollType[]>([])
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

  const setNumberOfDice = (dice: number) => {
    dispatch(setDiceAmount(dice))
  }

  const rollD6 = (dice: number) => {
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
    if (!showNewResultBottom) return
    const resultContainer = document.getElementById('d6Results')
    if (resultContainer) {
      resultContainer.scrollTop = resultContainer.scrollHeight
    }
  }, [rolls])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Shadowrun">
        <button
          className="btn btn-square btn-ghost ml-2"
          onClick={() => dispatch(clearRolls())}
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
        <Link href="/dice/shadowrun/config">
          <button className="btn btn-square btn-ghost">
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
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </Link>
      </Navbar>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <div className="h-full flex flex-col">
          <div className="flex-grow grid grid-cols-12 h-0 pb-4">
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
          <div className="flex-none border-t-2 pt-4">
            {useFreeInput && (
              <FreeDiceInput
                numberOfDice={numberOfDice}
                onNewNumber={setNumberOfDice}
                maxDiceAmount={maxDiceAmount}
              />
            )}

            {useQuickButtons && (
              <div>
                {quickButtons.map(({ id, type, amount }) => (
                  <button
                    className="btn btn-square btn-outline mx-2 relative"
                    key={id}
                    onClick={() => {
                      if (type === 'instantRoll') {
                        rollD6(amount)
                      } else {
                        setNumberOfDice(amount)
                      }
                    }}
                  >
                    {type === 'instantRoll' && (
                      <div className="bg-base-100 rounded-full absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                        ⚡
                      </div>
                    )}
                    {amount}
                  </button>
                ))}
              </div>
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
