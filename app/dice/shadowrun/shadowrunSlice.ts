import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DiceRollType } from './page'

const DEFAULT_CONFIG = {
  showNewResultBottom: true,
  useFreeInput: false,
  sortDice: false,
  useQuickButtons: true,
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
if (typeof window !== 'undefined') {
  const configString = window.localStorage.getItem('shadowrunConfig')
  if (configString) clientConfig = JSON.parse(configString)
}

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
  },
})

export const { setDiceAmount, clearRolls, addRoll, updateConfig } =
  shadowrunSlice.actions
export const shadowrunReducer = shadowrunSlice.reducer
