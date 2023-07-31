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
    <div className="flex justify-between my-2">
      <FreeDiceInput
        numberOfDice={quickButton.amount}
        onNewNumber={(newAmount) =>
          dispatch(updateQuickButton({ id: quickButton.id, amount: newAmount }))
        }
        maxDiceAmount={maxDiceAmount}
      />
      <Toggle
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
        className="btn btn-square"
        onClick={() => dispatch(deleteQuickButton(quickButton.id))}
      >
        <TrashIcon />
      </button>
    </div>
  )
}
