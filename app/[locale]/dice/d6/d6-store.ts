'use client'

import { create } from 'zustand'
import { createStoreMiddleware } from '@/utils/store-utils'
import { sanitizeIntegerInRange } from '@/utils/number-utils'

const MAX_DICE_AMOUNT = 8
const INITIAL_DICE_AMOUNT = 1

export type D6 = 1 | 2 | 3 | 4 | 5 | 6

export type D6RollResult = {
  results: D6[]
  type: 'D6'
  timestamp: number
  id: string
}

const DEFAULT_CONFIG = {
  maxDice: MAX_DICE_AMOUNT,
  showNewResultBottom: true,
  sortDice: false,
  isLoading: false,
  sumDice: false,
}

export type D6ConfigType = typeof DEFAULT_CONFIG

export interface D6State {
  diceAmount: number
  rolls: D6RollResult[]
  config: D6ConfigType
  setDiceAmount: (amount: number) => void
  clearRolls: () => void
  addRoll: (roll: D6RollResult) => void
  updateConfig: (config: Partial<D6ConfigType>) => void
}

export const useD6Store = create<D6State>()(
  createStoreMiddleware({
    stateCreator: (set) => ({
      diceAmount: INITIAL_DICE_AMOUNT,
      rolls: [],
      config: DEFAULT_CONFIG,
      setDiceAmount: (amount: number) =>
        set((state) => ({
          diceAmount: sanitizeIntegerInRange(amount, {
            min: INITIAL_DICE_AMOUNT,
            max: state.config.maxDice,
            fallback: INITIAL_DICE_AMOUNT,
          }),
        })),
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll: D6RollResult) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      updateConfig: (newConfig) =>
        set((state) => {
          const config = { ...state.config, ...newConfig }
          const maxDice = sanitizeIntegerInRange(config.maxDice, {
            min: INITIAL_DICE_AMOUNT,
            max: 999,
            fallback: MAX_DICE_AMOUNT,
          })
          let diceAmount = state.diceAmount
          if (typeof newConfig.maxDice === 'number') {
            diceAmount = Math.min(diceAmount, maxDice)
          }
          return {
            config: { ...config, maxDice },
            diceAmount: sanitizeIntegerInRange(diceAmount, {
              min: INITIAL_DICE_AMOUNT,
              max: maxDice,
              fallback: INITIAL_DICE_AMOUNT,
            }),
          }
        }),
    }),
    persistConfig: {
      name: 'd6-storage',
      partialize: (state) => ({
        config: state.config,
        diceAmount: state.diceAmount,
      }),
    },
  })
)
