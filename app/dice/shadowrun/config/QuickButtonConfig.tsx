'use client'

import {
  QuickButtonType,
  deleteQuickButton,
  updateQuickButton,
} from '../shadowrunSlice'
import { useDispatch } from 'react-redux'
import { Toggle } from './Toggle'

type QuickButtonConfigProps = {
  quickButton: QuickButtonType
}

export const QuickButtonConfig = ({ quickButton }: QuickButtonConfigProps) => {
  const dispatch = useDispatch()
  return (
    <div className="flex">
      <span>{quickButton.id}</span>
      <Toggle
        label="Roll instantly"
        checked={quickButton.type === 'instantRoll'}
        onChange={(isInstant) =>
          dispatch(
            updateQuickButton({ type: isInstant ? 'instantRoll' : 'setAmount' })
          )
        }
      />
      <button
        className="btn btn-square"
        onClick={() => dispatch(deleteQuickButton(quickButton.id))}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
