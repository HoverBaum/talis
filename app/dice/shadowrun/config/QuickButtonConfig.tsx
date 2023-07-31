'use client'

import {
  QuickButtonType,
  deleteQuickButton,
  updateQuickButton,
} from '../shadowrunSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Toggle } from './Toggle'
import { FreeDiceInput } from '../FreeDiceInput'
import { RootState } from '@/app/store'
import { TrashIcon } from '@/components/icons/TrashIcon'

type QuickButtonConfigProps = {
  quickButton: QuickButtonType
}

export const QuickButtonConfig = ({ quickButton }: QuickButtonConfigProps) => {
  const maxDiceAmount = useSelector(
    (state: RootState) => state.shadowrun.config.maxDiceAmount
  )
  const dispatch = useDispatch()
  return (
    <div className="grid grid-cols-6 grid-rows-2 md:grid-rows-1 md:grid-cols-12 gap-2 my-4 pb-4 border-b-2 border-base-100">
      <div className="col-span-6">
        <FreeDiceInput
          numberOfDice={quickButton.amount}
          onNewNumber={(newAmount) =>
            dispatch(
              updateQuickButton({ id: quickButton.id, amount: newAmount })
            )
          }
          maxDiceAmount={maxDiceAmount}
        />
      </div>
      <Toggle
        className="col-span-3 md:col-start-8 self-center"
        label="Roll instantly"
        checked={quickButton.type === 'instantRoll'}
        onChange={(isInstant) => {
          console.log('clicked', isInstant)
          dispatch(
            updateQuickButton({
              id: quickButton.id,
              type: isInstant ? 'instantRoll' : 'setAmount',
            })
          )
        }}
      />
      <button
        className="btn btn-square col-start-6 md:col-start-12"
        onClick={() => dispatch(deleteQuickButton(quickButton.id))}
      >
        <TrashIcon />
      </button>
    </div>
  )
}
