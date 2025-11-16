'use client'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { addRoll, clearRolls } from './daggerheart.slice'
import { DaggerheartResultDisplay } from './DaggerheartResultDisplay'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { useEffect } from 'react'
import { DictionaryType } from 'dictionaries/dictionanier'
import { ExtractProperty } from 'utils/extractProperty'
import { Button } from '@/components/ui/button'
import { useHeader } from '@/components/header-context'
import { RollerLayout } from '@/components/RollerLayout'

type DaggerheartDict = ExtractProperty<DictionaryType, 'Roller.Daggerheart'>

type Props = {
  dict: DaggerheartDict
}

export const DaggerheartRoller = ({ dict }: Props) => {
  const rolls = useSelector((state: RootState) => state.daggerheart.rolls)
  const dispatch = useDispatch()
  const { setTitle, setActions } = useHeader()

  // Set header title and actions
  useEffect(() => {
    setTitle('Daggerheart (beta)')
    setActions(
      <Button
        variant="ghost"
        size="icon"
        onClick={() => dispatch(clearRolls())}
      >
        <TrashIcon />
      </Button>
    )
    return () => {
      setTitle('Talis')
      setActions(null)
    }
  }, [setTitle, setActions, dispatch])

  const rollDice = () => {
    const hope = Math.floor(Math.random() * 12) + 1
    const fear = Math.floor(Math.random() * 12) + 1
    const roll = {
      hope,
      fear,
      timestamp: Date.now(),
      id: `${rolls.length + 1}`,
    }
    dispatch(addRoll(roll))
  }

  useEffect(() => {
    const container = document.getElementById('d12Results')
    if (container) {
      // Scroll container to its bottom.
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
    }
  }, [rolls])

  return (
    <div className="h-full">
      <RollerLayout
        resultsArea={
          <div
            id="d12Results"
            className="h-full overflow-y-auto no-scrollbar p-2 md:p-4 pr-2 flex flex-col-reverse"
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
        }
        buttonArea={
          <div className="px-2 md:px-4">
            <Button
              className="w-full my-2 max-w-[90%] md:max-w-full mx-auto"
              onClick={rollDice}
            >
              {dict.roll}
            </Button>
          </div>
        }
      />
    </div>
  )
}
