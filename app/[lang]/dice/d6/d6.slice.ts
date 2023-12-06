'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { D6RollResult } from './D6ResultDisplay'

const MAX_DICE_AMOUNT = 8
const INITIAL_DICE_AMOUNT = 1

const DEFAULT_CONFIG = {
  maxDice: MAX_DICE_AMOUNT,
  showNewResultBottom: true,
  sortDice: false,
  isLoading: true,
  sumDice: false,
}

export type D6ConfigType = typeof DEFAULT_CONFIG

export interface ShadowrunState {
  diceAmount: number
  rolls: D6RollResult[]
  config: D6ConfigType
}

// Initially load config from local storage.
let clientConfig: null | D6ConfigType = null

const initialState: ShadowrunState = {
  diceAmount: INITIAL_DICE_AMOUNT,
  rolls: [],
  config: clientConfig || DEFAULT_CONFIG,
}

export const d6Slice = createSlice({
  name: 'd6',
  initialState,
  reducers: {
    setDiceAmount: (state, action: PayloadAction<number>) => {
      state.diceAmount = action.payload
    },
    clearRolls: (state) => {
      state.rolls = []
    },
    addRoll: (state, action: PayloadAction<D6RollResult>) => {
      state.rolls.push(action.payload)
    },
    updateConfig: (state, action: PayloadAction<Partial<D6ConfigType>>) => {
      const newConfig: D6ConfigType = {
        ...state.config,
        ...action.payload,
      }
      state.config = newConfig
    },
  },
})

export const { setDiceAmount, clearRolls, addRoll, updateConfig } =
  d6Slice.actions
export const d6Reducer = d6Slice.reducer
