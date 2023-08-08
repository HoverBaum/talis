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
import { Checkbox } from './Checkbox'

type QuickButtonConfigProps = {
  quickButton: QuickButtonType
}

export const QuickButtonConfig = ({ quickButton }: QuickButtonConfigProps) => {
  const maxDiceAmount = useSelector(
    (state: RootState) => state.shadowrun.config.maxDiceAmount
  )
  const dispatch = useDispatch()
  return (
    <div className="grid grid-cols-6 grid-rows-2 md:grid-rows-1 md:grid-cols-12 gap-2 pb-4 border-b-2 border-base-300 mb-4">
      <div className="col-span-6 self-center">
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
      <Checkbox
        className="col-span-4 md:col-start-8 self-center"
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
        className="btn btn-square btn-sm col-start-7 md:col-start-12 self-center"
        onClick={() => dispatch(deleteQuickButton(quickButton.id))}
      >
        <TrashIcon />
      </button>
    </div>
  )
}
