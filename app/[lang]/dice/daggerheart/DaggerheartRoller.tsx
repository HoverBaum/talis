'use client'

import { Navbar } from '@/components/Navbar'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { addRoll, clearRolls } from './daggerheart.slice'
import { DaggerheartResultDisplay } from './DaggerheartResultDisplay'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { useEffect } from 'react'
import { DictionaryType } from 'dictionaries/dictionanier'
import { ExtractProperty } from 'utils/extractProperty'

type DaggerheartDict = ExtractProperty<DictionaryType, 'Roller.Daggerheart'>

type Props = {
  dict: DaggerheartDict
}

export const DaggerheartRoller = ({ dict }: Props) => {
  const rolls = useSelector((state: RootState) => state.daggerheart.rolls)
  const dispatch = useDispatch()

  const rollDice = () => {
    const hope = Math.floor(Math.random() * 12) + 1
    const fear = Math.floor(Math.random() * 12) + 1
    const roll = {
      hope,
      fear,
      timestamp: Date.now(),
      id: Date.now().toString() + Math.random().toString(36).slice(2, 5),
    }
    dispatch(addRoll(roll))
  }

  useEffect(() => {
    const container = document.getElementById('d12Results')
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [rolls])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title="Daggerheart">
        <button
          className="btn btn-square btn-ghost ml-2"
          onClick={() => dispatch(clearRolls())}
        >
          <TrashIcon />
        </button>
      </Navbar>
      <main className="flex-grow basis-0 p-2 md:p-4">
        <div className="h-full flex flex-col">
          <div
            id="d12Results"
            className="flex-grow overflow-y-auto no-scrollbar pr-2 flex flex-col"
          >
            {[...rolls].reverse().map((roll, index) => (
              <DaggerheartResultDisplay
                key={roll.id}
                roll={roll}
                isHighlighted={index === 0}
                dict={dict}
              />
            ))}
          </div>
          <div className="flex-none border-t-2 pt-4">
            <button
              className="btn btn-block btn-primary my-2 max-w-[90%] md:max-w-full mx-auto block"
              onClick={rollDice}
            >
              {dict.roll}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
