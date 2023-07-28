import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DiceRollType } from './page'

export interface ShadowrunState {
  diceAmount: number
  rolls: DiceRollType[]
}

const initialState: ShadowrunState = {
  diceAmount: 8,
  rolls: [],
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
  },
})

export const { setDiceAmount, clearRolls, addRoll } = shadowrunSlice.actions
export const shadowrunReducer = shadowrunSlice.reducer
