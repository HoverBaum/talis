'use client'

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type DaggerheartRoll = {
  hope: number
  fear: number
  timestamp: number
  id: string
}

export interface DaggerheartState {
  rolls: DaggerheartRoll[]
}

const initialState: DaggerheartState = {
  rolls: [],
}

export const daggerheartSlice = createSlice({
  name: 'daggerheart',
  initialState,
  reducers: {
    clearRolls: (state) => {
      state.rolls = []
    },
    addRoll: (state, action: PayloadAction<DaggerheartRoll>) => {
      state.rolls.push(action.payload)
    },
  },
})

export const { clearRolls, addRoll } = daggerheartSlice.actions
export const daggerheartReducer = daggerheartSlice.reducer
