'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DiceRollType } from './page'

export type QuickButtonTypes = 'instantRoll' | 'setAmount'
export type QuickButtonType = {
  amount: number
  type: QuickButtonTypes
  id: string
}

const DEFAULT_CONFIG = {
  showNewResultBottom: true,
  useFreeInput: false,
  sortDice: false,
  isLoading: true,
  useQuickButtons: true,
  quickButtons: [
    {
      amount: 1,
      type: 'instantRoll',
      id: 'initial1',
    },
    { amount: 8, type: 'setAmount', id: 'initial2' },
    { amount: 20, type: 'setAmount', id: 'initial3' },
  ] as QuickButtonType[],
}

export type ShadowrunConfigType = typeof DEFAULT_CONFIG

export interface ShadowrunState {
  diceAmount: number
  rolls: DiceRollType[]
  config: ShadowrunConfigType
}

// Initially load config from local storage.
let clientConfig: null | ShadowrunConfigType = null
// During Server Render we can not read local storage.
// if (typeof window !== 'undefined') {
//   const configString = window.localStorage.getItem('shadowrunConfig')
//   if (configString) clientConfig = JSON.parse(configString)
// }

const initialState: ShadowrunState = {
  diceAmount: 8,
  rolls: [],
  config: clientConfig || DEFAULT_CONFIG,
}

export const shadowrunSlice = createSlice({
  name: 'shadowrun',
  initialState,
  reducers: {
    setDiceAmount: (state, action: PayloadAction<number>) => {
      state.diceAmount = action.payload
    },
    clearRolls: (state) => {
      state.rolls = []
    },
    addRoll: (state, action: PayloadAction<DiceRollType>) => {
      state.rolls.push(action.payload)
    },
    updateConfig: (
      state,
      action: PayloadAction<Partial<ShadowrunConfigType>>
    ) => {
      const newConfig: ShadowrunConfigType = {
        ...state.config,
        ...action.payload,
      }
      localStorage.setItem('shadowrunConfig', JSON.stringify(newConfig))
      state.config = newConfig
    },
    deleteQuickButton: (state, action: PayloadAction<string>) => {
      state.config.quickButtons = state.config.quickButtons.filter(
        (button) => button.id !== action.payload
      )
    },
    updateQuickButton: (
      state,
      action: PayloadAction<Partial<QuickButtonType>>
    ) => {
      const button = state.config.quickButtons.find(
        (button) => button.id === action.payload.id
      )
      if (button) {
        button.amount = action.payload.amount || button.amount
        button.type = action.payload.type || button.type
      }
    },
  },
})

export const {
  setDiceAmount,
  clearRolls,
  addRoll,
  updateConfig,
  deleteQuickButton,
  updateQuickButton,
} = shadowrunSlice.actions
export const shadowrunReducer = shadowrunSlice.reducer
