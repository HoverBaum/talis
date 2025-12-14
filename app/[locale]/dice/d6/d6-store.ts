'use client'

import { create } from 'zustand'
import { z } from 'zod'
import { createStoreMiddleware } from '@/utils/store-utils'

const MAX_DICE_AMOUNT = 8
const INITIAL_DICE_AMOUNT = 1

export type D6 = 1 | 2 | 3 | 4 | 5 | 6

export type D6RollResult = {
  results: D6[]
  type: 'D6'
  timestamp: number
  id: string
}

/**
 * Schema for persisted state (matches partialize output).
 * This is the single source of truth for the persisted state structure.
 */
const persistedStateSchema = z.object({
  config: z.object({
    maxDice: z.number().min(1).max(50),
    showNewResultBottom: z.boolean(),
    sortDice: z.boolean(),
    isLoading: z.boolean(),
    sumDice: z.boolean(),
  }),
  diceAmount: z.number().min(1).max(50),
})

/**
 * Type derived from schema - ensures type safety matches validation.
 * This is the single source of truth for persisted state structure.
 */
export type PersistedD6State = z.infer<typeof persistedStateSchema>

/**
 * Config type derived from schema - ensures type safety matches validation.
 * This is the single source of truth for config structure.
 */
export type D6ConfigType = PersistedD6State['config']

const DEFAULT_CONFIG: D6ConfigType = {
  maxDice: MAX_DICE_AMOUNT,
  showNewResultBottom: true,
  sortDice: false,
  isLoading: false,
  sumDice: false,
}

export interface D6State extends PersistedD6State {
  config: D6ConfigType
  diceAmount: number
  rolls: D6RollResult[]
  setDiceAmount: (amount: number) => void
  clearRolls: () => void
  addRoll: (roll: D6RollResult) => void
  updateConfig: (config: Partial<D6ConfigType>) => void
}

export const useD6Store = create<D6State>()(
  createStoreMiddleware<D6State>({
    stateCreator: (set, get) => ({
      diceAmount: INITIAL_DICE_AMOUNT,
      rolls: [],
      config: DEFAULT_CONFIG,
      setDiceAmount: (amount: number) => set({ diceAmount: amount }),
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll: D6RollResult) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      updateConfig: (newConfig) =>
        set((state) => {
          const config = { ...state.config, ...newConfig }
          let diceAmount = state.diceAmount
          if (typeof newConfig.maxDice === 'number') {
            diceAmount = Math.min(diceAmount, newConfig.maxDice)
          }
          return { config, diceAmount }
        }),
    }),
    persistConfig: {
      name: 'd6-storage',
      version: 1,
      migrations: [],
      schema: persistedStateSchema,
      partialize: (state): PersistedD6State => ({
        config: state.config,
        diceAmount: state.diceAmount,
      }),
    },
  })
)
