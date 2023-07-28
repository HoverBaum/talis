import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ShadowrunState {
  diceAmount: number
}

const initialState: ShadowrunState = {
  diceAmount: 8,
}

export const shadowrunSlice = createSlice({
  name: 'shadowrun',
  initialState,
  reducers: {
    setDiceAmount: (state, action: PayloadAction<number>) => {
      state.diceAmount = action.payload
    },
  },
})

export const { setDiceAmount } = shadowrunSlice.actions
export const shadowrunReducer = shadowrunSlice.reducer
