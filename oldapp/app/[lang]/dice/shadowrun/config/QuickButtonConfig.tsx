'use client'

import {
  QuickButtonType,
  deleteQuickButton,
  updateQuickButton,
} from '../shadowrun.slice'
import { useDispatch, useSelector } from 'react-redux'
import { FreeDiceInput } from '../FreeDiceInput'
import { RootState } from '@/app/store'
import { TrashIcon } from '@/components/icons/TrashIcon'
import { Checkbox } from '@/components/ui/checkbox'
import { useDict } from 'dictionaries/useDict'
import { Button } from '@/components/ui/button'

type QuickButtonConfigProps = {
  quickButton: QuickButtonType
}

export const QuickButtonConfig = ({ quickButton }: QuickButtonConfigProps) => {
  const maxDiceAmount = useSelector(
    (state: RootState) => state.shadowrun.config.maxDiceAmount
  )
  const dispatch = useDispatch()
  const dict = useDict('Roller.Shadowrun.Config')

  return (
    <div className="grid grid-cols-6 grid-rows-2 md:grid-rows-1 md:grid-cols-12 gap-2 pb-4 border-b-2 mb-4">
      <div className="col-span-6 self-center">
        <FreeDiceInput
          variant="small"
          numberOfDice={quickButton.amount}
          onNewNumber={(newAmount) =>
            dispatch(
              updateQuickButton({ id: quickButton.id, amount: newAmount })
            )
          }
          maxDiceAmount={maxDiceAmount}
        />
      </div>
      <div className="col-span-4 md:col-start-8 self-center flex items-center space-x-2">
        <Checkbox
          id={`instant-${quickButton.id}`}
          checked={quickButton.type === 'instantRoll'}
          onCheckedChange={(isInstant) => {
            dispatch(
              updateQuickButton({
                id: quickButton.id,
                type: isInstant ? 'instantRoll' : 'setAmount',
              })
            )
          }}
        />
        <label
          htmlFor={`instant-${quickButton.id}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {dict.rollInstantly}
        </label>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="col-start-7 md:col-start-12 self-center"
        onClick={() => dispatch(deleteQuickButton(quickButton.id))}
      >
        <TrashIcon />
      </Button>
    </div>
  )
}
