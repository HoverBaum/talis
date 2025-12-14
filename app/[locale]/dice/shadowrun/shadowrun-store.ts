'use client'

import { create } from 'zustand'
import { z } from 'zod'
import { createStoreMiddleware } from '@/utils/store-utils'

const MAX_DICE_AMOUNT = 50

export type QuickButtonTypes = 'instantRoll' | 'setAmount'
export type QuickButtonType = {
  amount: number
  type: QuickButtonTypes
  id: string
}

export type DiceRollType = {
  results: number[]
  type: 'Shadowrun'
  timestamp: number
  id: number
  shadowrun?: {
    hits: number
    isGlitch: boolean
    isCriticalGlitch: boolean
  }
}

/**
 * Schema for persisted state (matches partialize output).
 * This is the single source of truth for the persisted state structure.
 */
const persistedStateSchema = z.object({
  config: z.object({
    showNewResultBottom: z.boolean(),
    useFreeInput: z.boolean(),
    sortDice: z.boolean(),
    isLoading: z.boolean(),
    useQuickButtons: z.boolean(),
    useThemeHighlights: z.boolean(),
    maxDiceAmount: z.number().min(1).max(100),
    quickButtons: z.array(
      z.object({
        amount: z.number().min(1).max(100),
        type: z.union([z.literal('instantRoll'), z.literal('setAmount')]),
        id: z.string(),
      })
    ),
  }),
  diceAmount: z.number().min(1).max(100),
})

/**
 * Type derived from schema - ensures type safety matches validation.
 * This is the single source of truth for persisted state structure.
 */
export type PersistedShadowrunState = z.infer<typeof persistedStateSchema>

/**
 * Config type derived from schema - ensures type safety matches validation.
 * This is the single source of truth for config structure.
 */
export type ShadowrunConfigType = PersistedShadowrunState['config']

const DEFAULT_CONFIG: ShadowrunConfigType = {
  showNewResultBottom: true,
  useFreeInput: false,
  sortDice: false,
  isLoading: false,
  useQuickButtons: true,
  useThemeHighlights: true,
  maxDiceAmount: MAX_DICE_AMOUNT,
  quickButtons: [
    {
      amount: 1,
      type: 'instantRoll' as QuickButtonTypes,
      id: 'initial1',
    },
    { amount: 8, type: 'setAmount' as QuickButtonTypes, id: 'initial2' },
    { amount: 20, type: 'setAmount' as QuickButtonTypes, id: 'initial3' },
  ] as QuickButtonType[],
}

export interface ShadowrunState extends PersistedShadowrunState {
  config: ShadowrunConfigType
  diceAmount: number
  rolls: DiceRollType[]
  setDiceAmount: (amount: number) => void
  clearRolls: () => void
  addRoll: (roll: DiceRollType) => void
  updateConfig: (config: Partial<ShadowrunConfigType>) => void
  deleteQuickButton: (id: string) => void
  updateQuickButton: (button: Partial<QuickButtonType> & { id: string }) => void
}

export const useShadowrunStore = create<ShadowrunState>()(
  createStoreMiddleware<ShadowrunState>({
    stateCreator: (set, get) => ({
      diceAmount: 8,
      rolls: [],
      config: DEFAULT_CONFIG,
      setDiceAmount: (amount: number) => set({ diceAmount: amount }),
      clearRolls: () => set({ rolls: [] }),
      addRoll: (roll: DiceRollType) =>
        set((state) => ({
          rolls: [...state.rolls, roll],
        })),
      updateConfig: (newConfig: Partial<ShadowrunConfigType>) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      deleteQuickButton: (id: string) =>
        set((state) => ({
          config: {
            ...state.config,
            quickButtons: state.config.quickButtons.filter(
              (button) => button.id !== id
            ),
          },
        })),
      updateQuickButton: (updatedButton: Partial<QuickButtonType> & { id: string }) =>
        set((state) => ({
          config: {
            ...state.config,
            quickButtons: state.config.quickButtons.map((button) =>
              button.id === updatedButton.id ? { ...button, ...updatedButton } : button
            ),
          },
        })),
    }),
    persistConfig: {
      name: 'shadowrun-storage',
      version: 1,
      migrations: [],
      schema: persistedStateSchema,
      partialize: (state): PersistedShadowrunState => ({
        config: state.config,
        diceAmount: state.diceAmount,
      }),
    },
  })
)

